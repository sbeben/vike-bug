#!/bin/sh

docker run -p 4000:4000 --name hello --env-file ./.env hello