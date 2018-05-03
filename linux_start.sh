#!/bin/bash
CDDIR=`dirname "$BASH_SOURCE"`
NWDIR="$CDDIR/../linux/node-webkit"
echo  "CDDIR is '$CDDIR'"
echo  "NWDIR is '$NWDIR'"
{
if [ ! -e $NWDIR ]; then
    NWDIR="$CDDIR/../../linux/node-webkit"
    echo  "NWDIR(2) is '$NWDIR'"
fi
}
$NWDIR/nw $CDDIR/splash
