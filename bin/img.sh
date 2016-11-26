#!/bin/bash

command -v convert >/dev/null 2>&1 || { echo >&2 "I require imagemagik but it's not installed. Aborting."; exit 1; }

for i in "$@"
do
  case $i in
      --src-file=*)
      SRC_FILE="${i#*=}"
      shift # past argument=value
      ;;

      --dst-file=*)
      DST_FILE="${i#*=}"
      shift # past argument=value
      ;;

      --dst-path=*)
      DST_PATH="${i#*=}"
      shift # past argument=value
      ;;

      --new-size=*)
      NEW_SIZE="${i#*=}"
      shift # past argument=value
      ;;
      *)
            # unknown option
      ;;
  esac
done

echo "Resizing $SRC_FILE > $DST_FILE > $DST_PATH @ $NEW_SIZE"

mkdir -p "$DST_PATH"
convert "$SRC_FILE" -resize $NEW_SIZE -quality 100 "$DST_FILE"
