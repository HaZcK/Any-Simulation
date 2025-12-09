const input = document.getElementById('cmd-input');
const screen = document.getElementById('interface-layer');
const dynamicZone = document.getElementById('dynamic-zone');

// --- DATABASE COMMANDS ---
const commands = {
    // 1. Command Utama
    '.listscript': () => {
        return `<span style="color:white">
        AVAILABLE COMMANDS:
        -------------------
        1.  <b class="sys-warn">.OpenBts</b>    : Tampilkan/Edit Source Code HTML layar ini (Behind The Scene)
        2.  <b>.makeFile [nama]</b> : Membuat file dummy di layar (DOM Manipulation)
        3.  <b>.clear</b>       : Bersihkan layar
        4.  <b>.time</b>        : Cek waktu server lokal
        5.  <b>.sysinfo</b>     : Informasi Browser/OS
        6.  <b>.matrix</b>      : Efek visual Matrix (Toggle)
        7.  <b>.calc [a+b]</b>  : Hitung matematika sederhana
        8.  <b>.destroy</b>     : Simulasi kerusakan sistem
        9.  <b>.color [hex]</b> : Ubah warna text terminal
        10. <b>.reboot</b>      : Restart ke Main Menu
        11. <b>.whoami</b>      : Cek identitas user
        -------------------
        </span>`;
    },

    // 2. BEHIND THE SCENE (INTI PERMINTAAN)
    '.OpenBts': () => {
        // Mengambil seluruh HTML dari interface-layer
        const rawHTML = document.getElementById('interface-layer').innerHTML;
        
        // Mengubah karakter < dan > agar tampil sebagai teks, bukan render HTML
        const safeHTML = rawHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        return `
        <div class="sys-warn">--- BEHIND THE SCENE (SOURCE CODE) ---</div>
        <div class="sys-warn">Mode: Read-Only View of DOM Structure</div>
        <div class="sys-code">${safeHTML}</div>
        <div class="sys-warn">--------------------------------------</div>
        <div style="color:white">Tip: Gunakan command <b>.makeFile</b> untuk melihat perubahan kode di atas secara real-time.</div>
        `;
    },

    // 3. Make File (Menambah elemen HTML baru secara dinamis)
    '.makeFile': (arg) => {
        if(!arg) return `<span class="sys-error">Error: Masukkan nama file. Contoh: .makeFile rahasia.txt</span>`;
        
        const newDiv = document.createElement('div');
        newDiv.className = 'dynamic-box';
        newDiv.innerHTML = `📄 ${arg}`;
        dynamicZone.appendChild(newDiv);
        
        return `<span class="sys-success">Success: File '${arg}' ditambahkan ke DOM. Cek .OpenBts untuk melihat perubahannya.</span>`;
    },

    // 4. Time
    '.time': () => {
        return `Current System Time: ${new Date().toLocaleTimeString('id-ID')}`;
    },

    // 5. System Info
    '.sysinfo': () => {
        return `Platform: ${navigator.platform} | Agent: ${navigator.userAgent.substring(0, 50)}...`;
    },

    // 6. Matrix Effect (Simulasi Text Acak)
    '.matrix': () => {
        let rain = setInterval(() => {
            const span = document.createElement('div');
            span.style.color = '#0f0';
            span.style.opacity = Math.random();
            span.innerText = Math.random().toString(36).substring(2, 15);
            screen.appendChild(span);
            screen.scrollTop = screen.scrollHeight;
        }, 50);
        
        setTimeout(() => { clearInterval(rain); log("Matrix effect stopped.", "sys-warn"); }, 2000);
        return "Initiating Matrix Protocol...";
    },

    // 7. Calculator
    '.calc': (arg) => {
        try {
            // Menggunakan fungsi eval() untuk kalkulasi cepat, hati-hati dalam produksi nyata!
            const result = eval(arg);
            return `Result: ${arg} = ${result}`;
        } catch {
            return `<span class="sys-error">Math Error. Use format: .calc 5+5</span>`;
        }
    },

    // 8. Destroy (Prank)
    '.destroy': () => {
        document.body.style.transition = "1s";
        document.body.style.transform = "rotate(5deg) scale(0.9)";
        document.body.style.filter = "blur(2px)";
        setTimeout(() => {
            document.body.style.transform = "none";
            document.body.style.filter = "none";
        }, 3000);
        return `<span class="sys-error">CRITICAL ERROR! SYSTEM UNSTABLE... (Restoring...)</span>`;
    },

    // 9. Color Changer
    '.color': (arg) => {
        if(!arg) return "Error: Masukkan kode warna. Contoh: .color #ff0000";
        document.body.style.color = arg;
        document.querySelector('.cmd-dock').style.borderColor = arg;
        document.querySelector('.cmd-dock').style.boxShadow = `0 0 15px ${arg}`;
        return `System color changed to ${arg}`;
    },

    // 10. Reboot
    '.reboot': () => {
        // Pindah ke parent folder (index.html) dari folder assets/
        setTimeout(() => window.location.href = '../index.html', 1500); 
        return "Rebooting system... Bye!";
    },

    // 11. Whoami
    '.whoami': () => "User: Administrator | Access Level: ROOT";
};

// --- LOGIKA UTAMA EVENT HANDLER ---

function log(msg, type = '') {
    const div = document.createElement('div');
    div.className = `log-item ${type}`;
    div.innerHTML = msg;
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const raw = input.value.trim();
        if (!raw) return;

        const args = raw.split(' ');
        const cmd = args[0];
        const param = args.slice(1).join(' '); 

        log(`root@executor:~$ ${raw}`, 'sys-warn');

        if (cmd === '.clear') {
            screen.innerHTML = '';
        } else if (commands[cmd]) {
            const response = commands[cmd](param);
            if (response) log(response);
        } else {
            log(`Command '${cmd}' not found. Type .listscript for help.`, 'sys-error');
        }

        input.value = '';
    }
});
      
