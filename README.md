pour lancer le back-end : 
cd backend 
npm install --force
node server

pour lancer le front-end : (dans un nouveau terminal)
cd frontend
npm install
npm run dev

En cas d'erreur au lancement du back-end, (log : Erreur de connexion MongoDB : querySrv ESERVFAIL _mongodb._tcp...), essayer avec un autre reseau wifi ou ajouter le serveur DNS (8.8.8.8) au wifi sur lequel vous êtes connecté 

Ce projet consiste en la création d'un site pour consulter la base de données Muséofile qui répertorie l'ensemble des musées du territoire français. Le site nous permet, via l'API de la base de données, de lancer des recherches à propos de ces musées basées sur different critères (dans le cas de ce projet, les critères sont : le nom, la ville, le département,  la région, ainsi que les domaines thématiques).

Il y'a également un système de login et sign up grâce à une API Express, ainsi qu'un système de favoris lorsque l'utilisateur est connecté

Le projet consiste en 4 pages differentes : 

+ Une page d'accueil (/home) sur laquelle il est possible de lancer la recherche de musée (sans être login). On retrouve également une navbar qui nous permet d'acceder a la page de login, ainsi qu'a la page de profil et le bouton de deconnexion (dans le cas ou l'utilisateur est déconnecté)

+ Une page de login (/login) permettant via 2 inputs (email et mot de passe) de se connecter ou de s'inscrire. L'inscription/connexion permet seulement de mettre des musées en favoris pour les consulter plus tard. Le reste des fonctionnalités du site est accessible sans connexion.

+ Une page de profil (/profile) sur laquelle se trouve l'adresse mail de l'utilisateur ainsi qu'une liste des musées favoris, contenant des "cartes" permettant d'acceder directement aux musées sans passer par la recherche.

+ Une page dédiée au musées (/musee/:id) qui répertorie toutes les informations du musée séléctionné, comme sa localisation via une carte, son histoire, etc... C'est également sur cette page que l'on retrouve la possibilité de mettre le musée en favori. 

Les technologies utilisées sont : 

Pour le front-end : React.js, Vite, SaSS, JS, Vercel

Pour le back-end : JS, Express (node.js), MongoDB (Base de donnée), Render

Concernant l'API Express, on y retrouve 4 requetes differentes : 

router.post('/favorites', auth, favoriteCtrl.toggleFavorite); Pour mettre ou retirer un musée en favori
router.get('/favorites', auth, favoriteCtrl.getFavorites); Pour récuperer les favoris 
router.post('/login', userCtrl.login); Pour se connecter
router.post('/signup', userCtrl.signup); Pour s'inscrire


