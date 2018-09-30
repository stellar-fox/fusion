### Create symbolic link.

Make sure that `src/config.localhost.js` and/or
`config.production.js` exists and then create symbolic
link in this directory to point to one of those.

Run the following from within this directory:

    ln -s ../src/config.localhost.js ./config.js

This symbolic link will import configuration info needed
by _Firebase_.
