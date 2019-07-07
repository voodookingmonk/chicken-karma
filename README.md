# Arvutimängu "Chicken Karma" demo
## Raimo Pregel, Henri Tammo, Vahur Vogt, Merilin Võrk

Tallinna Ülikooli digitehnoloogiate instituudi tarkvaraarenduse praktika raames valmis 6. rühmal arvutimäng. 

Mäng on loodud Phaser raamistikuga ja kasutades JavaScript-i. Tegemist on action rollimänguga (RPG - Role-Playing Game), kus mängija eesmärk on päästa küla koletiste käest ja koguda karmapunkte. Projekti ajendiks oli meeskonnaliikmete huvi arvutimängude loomise vastu ning soov proovida leida mängule uudne, kaasahaarav ning uuesti mängima kutsuv puänt. 

### Kasutatud tehnoloogiad: 
1. Phaser 3.17.0
2. ECMAScript 2015 (JS ES6)
3. JQuery 3.4.1
4. Apache 2.4.3 (Z-WAMP 2.2.1)
5. HTML5
6. CSS3

### Arendusvahendid:
1. Hub 2.11.2
2. Jira 8.2.2
3. Visual Paradigm 15.2
4. Z-WAMP 2.2.1
5. Adobe Photshop 2019
6. Tiled 1.2.4
7. Visual Studio Code 1.35.1

### Paigaldusjuhised:

#### Kui kloonida GitHub-i, siis on vöimalik kasutada GitHubi enda tasuta teenust, et käivitada mängu nende serveris.
1. Alusta projekti kloonimisega - 
`$ git clone https://github.com/raimop/tap.git`
2. Selleks on vaja minna enda kloonitud repositooriumisse, sealt valida "Settings", siis otsida üles "GitHub Pages" valida korrektne "source" (vaikimisi peaks olema master branch). 
3. Seejärel uueneb ja tekib kiri: "Your site is ready to be published at https://kasutajanimi.github.io/repositooriumi_nimi." 
4. Viimaks tuleb minna lingile: https://kasutajanimi.github.io/repositooriumi_nimi/index.html

#### Vöimalik veel laadida failid üles iseenda veebiserverisse vöi kasutada lokaalset veebiserverit (näiteks Z-WAMP 2.2.1 -i alla laadides ja üles seades, mis sisaldab Apache 2.4.3 http serverit).
1. Selleks lae alla Z-WAMP aadressilt http://zwamp.sourceforge.net/
2. Paigalda .zip fail soovitud kohta
3. Sisene paigaldatud kausta ja seejärel vdrive/web/
4. Sinna kausta kloonida 
`$ git clone https://github.com/raimop/tap.git`
5. Käivitada peakaustas zwamp.exe fail
6. Seejärel minna veebribrauseris aadressile: localhost/chicken-karma/index.html (vöi localhost:80/chicken-karma/index.html) 

#### NB! Kui Z-WAMPi käivitamisega ei käivitu Apache veebiserver, siis on vöimalik, et port 80 on juba kasutuses teise veebiserveri poolt.
1. Selleks tuleb leida üles Z-WAMPi ikoon tegumiriba (*taskbar*) süsteemisalvest (*system tray/notification area*)
2. Vajutada sellel paremat nuppu, sealt valida "Configuration"
3. Seejärel valida "Apache Main"
4. Sealt otsida üles "ServerName" ja muuta "localhost:" taga olev number 80 näiteks numbriks 8080
5. Lisaks 3 rida alt poolt "Listen" number 80 muuta samuti samaks arvuks, mille muutsid eelmisel real ehk 8080
6. Seejärel salvestada fail ja leida üles uuesti Z-WAMPi ikoon süsteemisalvest ja valida ülevalt "Restart"
Pärast seda veenduge, et pärast Z-WAMPile vajutamist süsteemisalvest oleks "Services" alt näha, et "Apache" ees on sinise tagataustaga linnuke.


![Pilt mängust](https://github.com/raimop/tap/blob/master/Capture1.PNG)

#### Mäng aadressil: https://raimop.github.io/chicken-karma/index.html

#### Dokumentatsioon:
 https://docs.google.com/document/d/1pv5wdfglbeUKZaPArzpP4L2ZFNS06ZgfNsZDOravHyo/edit?usp=sharing

#### Mängu kirjeldus:
 https://docs.google.com/document/d/1uMksxKzDv4DrD2q9vAxyl20p2XT8bZKm1R1YyL1ddyk/edit?usp=sharing
 
#### Meeskonna blogi:
http://suvepraktika.cs.tlu.ee/2019/ryhm06/
 
![Litsents](https://github.com/raimop/tap/blob/master/LICENSE.md)
