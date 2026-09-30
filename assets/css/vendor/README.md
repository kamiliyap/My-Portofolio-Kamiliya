# Bootstrap Contact build

`bootstrap-contact.css` is compiled from the official Bootstrap **5.3.3**
Sass Forms and Buttons components, not a custom imitation of their class names.
Source: https://getbootstrap.com/docs/5.3/customize/sass/

Every component selector is scoped under `#contact-form`. Reboot, navigation,
global typography and Bootstrap JavaScript are not included. The existing theme
variables supply colors, and `../contact-form.css` styles the portfolio form.

The compiled CSS is committed as a static asset; no Node or build step is needed
to serve the PHP site. To rebuild from the project root with Node/npm installed:

```powershell
$buildDir = Join-Path $env:TEMP 'kamiliya-bootstrap-form-build'
npm.cmd install --prefix $buildDir --no-audit --no-fund bootstrap@5.3.3 sass@1.77.8
& "$buildDir/node_modules/.bin/sass.cmd" --load-path="$buildDir/node_modules" --no-source-map assets/scss/bootstrap-contact.scss assets/css/vendor/bootstrap-contact.css
```

Bootstrap's MIT license is included in `bootstrap-LICENSE.txt`.
