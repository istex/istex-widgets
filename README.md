# Widgets ISTEX

> Ce module est obsolete, il est remplacé par celui ci : https://github.com/istex/istex-widgets-angular

Widgets (auth, search, results, facets) permettant de créer rapidement des interface Web d'interrogation des ressources ISTEX.

## Usage classique des widgets

Exemple d'utilisation classique des widgets search et results. Il est nécessaire dans un premier temps de charger les fichiers JS et CSS des widgets Istex (head de la page HTML) ainsi que la librairie jQuery qui est une dépendance nécessaire.

Ensuite vous pouvez placer  deux éléments (zone de recherche & zone de résultats) où vous le souhaitez dans votre page HTML.
Finalement il reste à exécuter les deux plugins (un par widget) sur ces deux éléments.

Voici ce que ca peut donner sur une page quasi vierge :

```html
<html>
  <head>

    <!-- jQuery est une dépendance nécessaire -->
    <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>

    <!-- Charge les widgets Istex -->
    <script type="text/javascript">
      var istexConfig = {
        // paramètres du widget (cf section plus bas)
      };
    </script>
    <script type="text/javascript" src="//widgets.istex.fr/js/widgets.min.js"></script>
    <link rel="stylesheet" href="//widgets.istex.fr/themes/default/widgets.min.css" />

    <style>
      #mysite-search, #mysite-results {
        width: 600px;
      }
    </style>

  </head>
  <body>

    <div id="mysite-auth"></div>
    <div id="mysite-search"></div>
    <div id="mysite-facets"></div>
    <div id="mysite-results"></div>

    <script type="text/javascript">
      // charge les widgets dans les éléments HTML ciblés
      $('#mysite-auth').istexAuth();
      $('#mysite-search').istexSearch();
      $('#mysite-facets').istexFacets();
      $('#mysite-results').istexResults();
    </script>

  </body>
</html>
```

## Paramètres des widgets

Les widgets peuvent être paramétrés en positionnant les clés/valeurs de la variable globale istexConfig. La liste des différents paramètres (pour [la liste exhaustive, cf code source](https://github.com/istex/istex-widgets/blob/master/istexconfigdefault.js)) se présente comme ceci :

```javascript
var istexConfig = {
  // l'adresse de l'API de l'Istex
  // pour une ezproxyfication, réglez ici l'adresse ezproxyfiée
  // ex à l'UL: https://api-istex-fr.bases-doc.univ-lorraine.fr
  istexApi: 'https://api.istex.fr',

  // pour lancer une recherche au chargement de la page
  // indiquer les mots à rechercher (argument de ?q= au niveau de l'api istex)
  query: "",

  // il est possible de ne charger que certaines facettes
  facetsToLoad: [ 'corpus' ],

  // il est possible de cacher la zone de pagination avec ce paramètre
  showPagination: true,

  // nombre de résultats souhaités par page
  pageSize: 10,

  // nombre max de pages à montrer dans la zone de pagination
  maxPagesInPagination: 10,

  // le nombre max de caractères du résumé à afficher
  abstractLength: 250,

  // le nombre max de caractères du titre à afficher
  titleLength: 100,

  // le format qu'on souhaite voir s'ouvrir quand on clique sur le titre
  fullTextOnTitle: 'pdf',

  // il est possible de cacher l'affichage de la vitesse de la requête
  // ex: "Environ 8 933 993 résultats (0.24 secondes)"
  //     si showQuerySpeed vaut false, "(0.24 secondes)" ne sera pas affiché
  showQuerySpeed: true,

  // les différents textes paramétrables
  labels: {
    facets: {
      'title' : 'Affiner votre recherche',
      'corpus' : 'Corpus',
    }
  },

  // le nom de l'événement émit au moment de l'authentification réussie
  connectedEventName: "istex-connected",

  // le nom de l'événement émit au moment où une nouvelle recherche est envoyée
  newSearchEventName: "istex-search",

  // le nom de l'événement émit au moment d'une recherche
  resultsEventName: "istex-results",

  // le nom de l'événement émit au moment d'un changement de page
  gotoPageEventName: "istex-gotopage",

  // le nom de l'événement émit a chaque fois qu'une recherche est envoyée
  // et qui donnera probablement (sauf erreur) lieux à un event "istex-results"
  waitingForResultsEventName: "istex-waiting-for-results"
};
```

Remarque : ces paramètres doivent être de préférence positionnés avant l'inclusion des fichiers widget.min.js et de widget.min.css

## Fonctionnement du widget istexAuth

Ce widget permet d'insérer dans la page HTML un bouton de connexion qui s'affiche uniquement si l'utilisateur n'est pas connecté. 

Différents moyens de connexion son successivement testés :
- cookie (cas rencontré avec avec ezproxy & CAS)
- http (login & mot de passe demandé)
- ip (possible d'attaquer l'api en ajax directement)

Une fois la connexion réalisée, le widget envoi l'évènement "istex-connected" au widget istexSearch qui ne s'affiche pas avant d'avoir reçu cet évènement.

## Fonctionnement du widget istexSearch

Ce widget permet d'insérer dans la page HTML une zone de saisie ainsi qu'un bouton de recherche. Lorsqu'une suite de mots sont tapés puis que le bouton rechercher est pressé, l'API Istex est interrogée à travers des requêtes AJAX. Une fois les résultats reçus, ils sont propagés aux widgets results et facets mais également à l'ensemble du DOM sous la forme d'un événement javascript (par défaut nommé "istex-results").

## Fonctionnement du widget istexResults

Ce widget permet d'insérer dans la page HTML la liste des résultats issus d'une recherche. Il a besoin donc besoin du widget istexSearch pour fonctionner. En effet, il se charge de capturer l'évènement "istex-results" puis de construire la liste des résultats à l'endroit souhaité dans la page HTML.

## Fonctionnement du widget istexFacets

Ce widget permet d'insérer dans la page HTML des facettes permettant d'affiner la recherche courante de l'utilisateur. A l'aide de la facette corpus, on peut ainsi n'afficher que les résultats provenant d'un éditeur précis.
Les facettes actuellement gérées sont les suivantes :
- corpus

Il est possible de n'afficher que certaines facettes en modifiant le paramètre ``facetsToLoad`` dans istexConfig.

## Documentation développeurs

### Installation d'un environnement de développement

Voici les étapes permettant de mettre en place une environnement de développement :

Installer NodeJS et npm (exemple sous Linux avec l'outil [nvm](https://github.com/creationix/nvm)) :
```
curl https://raw.githubusercontent.com/creationix/nvm/v0.20.0/install.sh | bash
nvm install 0.10
nvm use 0.10
```
Exemple pour installer nodejs et npm sous MacOSX :
```
brew install node
```

Sous windows, télécharger et installer nodejs et git depuis leurs sites :
- http://nodejs.org/download/
- http://git-scm.com/download/win

Récupérer le dépôt git des widgets Istex (au choix via SSH ou via HTTPS) :
```
git clone git@github.com:istex/istex-widgets.git
git clone https://github.com/istex/istex-widgets.git
```

Initialiser les dépendances (gulp est l'outil de build) :
```
cd istex-widgets/
npm install
npm install -g gulp bower
gulp init
```

De façon alternative (pour les utilisateurs Windows), il est possible de :
```
cd istex-widgets/
npm install -g http-server bower
bower install
```

Vous êtes alors opérationels pour développer votre contribution.

### Tester, compiler et déployer

Pour développer et tester les widgets depuis votre navigateur Web, le plus simple est de lancer un mini serveur Web avec la commande suivante :
```
gulp http
# pour windows la commande suivante: http-server
```

Puis ouvrez les URL qui s'affichent dans votre navigateur. Exemple: http://127.0.0.1:8080/index.html pour une vue d'ensemble.

Les tests unitaires se trouvent dans le répertoire ''./test/'' (le [framework mocha](http://mochajs.org/) est utilisé), pour les exécuter, tapez :
```
gulp test
```

Pour compiler les widgets vers le répertoire ''./dist/'', tapez :
```
gulp build
```
Pour déployer les widgets sur le site [istex.github.io](http://istex.github.io/) ([dépôt git](https://github.com/istex/istex.github.io)), tapez :
```
gulp deploy
```

### Créer et publier une nouvelle version des widgets

Le [semantic versioning](http://semver.org/) est utilisé pour la nomenclature des versions. Pour incrémenter la version au niveau "patch" (c'est à dire une petite modification), on utilise npm de façon classique :

```
npm version patch
git push --tags
./tools/
```

Ensuite pour déployer cette version aux utilisateurs finaux. Il est nécessaire de déployer la version sur le dépôt [istex.github.io](http://istex.github.io/) qui est accessible dans le répertoire ''dist/''. Voici comme déployer la version sur dist/:

```
# synchronisation du dernier tag avec le répertoire dist/ (qui représente la version)
./tools/create-last-tag-to-dist

# synchronisation/création du/des répertoires correspondant à chaque version des widgets dans dist/
./tools/create-v-folders-to-dist

# ajout, commit et push des répertoires de version
cd dist/
git add latest/
git add v*
git commit -m "Add or update version folder" .
git push
```

Au final, l'utilisateur pourra accéder aux différentes version des widgets sur http://widgets.istex.fr/ de cette façon :
- Pour utiliser la dernière version stable des widgets, les fichiers sont présent ici :
  - http://widgets.istex.fr/latest/js/widgets.min.js
  - http://widgets.istex.fr/latest/themes/default/widgets.min.css
- Pour utiliser la version v1.1.0 des widgets, les fichiers sont présent ici :
  - http://widgets.istex.fr/v1.1.0/js/widgets.min.js
  - http://widgets.istex.fr/v1.1.0/themes/default/widgets.min.css
- Pour utiliser la version en cours de dev des widgets (version potentiellement instable), les fichiers sont présents ici :
  - http://widgets.istex.fr/js/widgets.min.js
  - http://widgets.istex.fr/themes/default/widgets.min.css


