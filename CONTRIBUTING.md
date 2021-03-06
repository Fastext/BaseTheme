# Contributing to BaseTheme

BaseTheme is built upon `Twig`, `Webpack`, `ES6` and `LESS`. If you want to 
take part in improving our *Roadiz* theme boilerplate, we encourage you to know 
a minimum about these frontend technologies.

We keep this theme starter as fresh as possible and some technology choices 
may changes among time. For example, we are waiting for *Bootstrap 4* to
release as a stable version to switch to `Sass` for CSS preprocessing.

## Ignored files

**Be careful:** by default, all built CSS and JS files are ignored from *Git*
history so that they don’t annoy developers team when merging code. **But** when you 
need to improve this *BaseTheme* you’ll need to `git add --force` these file to make
them available when somebody clone or generate a theme with Roadiz for the first
time.

- static/js/*.js
- static/css/*.css
- Resources/views/partials/*.twig
- Resources/views/svg/sprite.svg.twig

These files **MUST** be available on `master` or `develop` branch at any time.
Even if they are *gitignored*, they are needed for *Roadiz* to display your theme.

## Use EditorConfig 

We added an `.editorconfig` file to make developers use the same codestyle. Please
install the plugin if you’re working with *Atom*, *Sublime Text*, … editors.
