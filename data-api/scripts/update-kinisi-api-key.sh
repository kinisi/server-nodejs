#!/bin/bash

# Inspired by https://github.com/jmattsson/fuseloop

DIR=$(readlink -f $(dirname $(readlink -f "${0}"))/../downloads/images)
echo "${DIR}"

USERID="${1}"
TOKEN="${2}"

if [ -z "${USERID}" ] ; then
  echo "Please enter the userid (not full path, first parameter)"
  exit 1
fi

# Test from http://stackoverflow.com/questions/2210349/bash-test-whether-string-is-valid-as-an-integer

if [[ ! "${USERID}" =~ ^-?[0-9]+$ ]] ; then
  echo "Userid must be a number"
  exit 1
fi

if [ -z "$2" ] ; then
  echo "Please enter an API-key value (second parameter)"
  exit 1
fi

SRC_IMG="${DIR}/kinisi-rpi-blank.img"
DST_IMG="${DIR}/kinisi-rpi-userid-${USERID}.img"
sectorsize=512

fdisk -c -u -l -C 300 -H 64 -S 32 -b 512 "${SRC_IMG}" | grep Linux | while read line
do

  set -- $line
  offs=$(($2*$sectorsize))
  size=$((($3-$2)*$sectorsize))

  echo "Copying ${SRC_IMG} to ${DST_IMG}"
  cp "${SRC_IMG}" "${DST_IMG}"

  TEMPDIR=$(mktemp -d)
  echo "Mounting the image to ${TEMPDIR}"
  sudo mount -o loop,rw,offset=$offs "${DST_IMG}" "${TEMPDIR}"

  echo "Writing token (${TOKEN}) to auth.js"
  echo -e "module.exports = {\n    'token': '${TOKEN}'\n}" | sudo tee "${TEMPDIR}/usr/local/kinisi-agent-nodejs/config/auth.js" > /dev/null 

  echo "Unmounting image"
  sudo umount "${TEMPDIR}"
  rmdir "${TEMPDIR}"

  echo "Compressing resulting image"
  gzip "${DST_IMG}"

done
