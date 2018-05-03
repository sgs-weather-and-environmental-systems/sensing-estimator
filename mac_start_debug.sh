#!/bin/bash
CDDIR=`dirname "$BASH_SOURCE"`
NWDIR="$CDDIR/../mac/node-webkit"
echo  "CDDIR is '$CDDIR'"
echo  "NWDIR is '$NWDIR'"
{
if [ ! -e $NWDIR ]; then
    NWDIR="$CDDIR/../../mac/node-webkit"
    echo  "NWDIR(2) is '$NWDIR'"
fi
}
cp -f $CDDIR/splash/package.debug $CDDIR/splash/package.json
$NWDIR/nwjs.app/Contents/MacOS/nwjs $CDDIR/splash
