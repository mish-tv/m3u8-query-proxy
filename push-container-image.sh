set -eu

TAG="v0.0.3"

gcloud config set project mish-tv

current=${PWD}
cd ./container/server
gcloud builds submit --substitutions=_TAG=${TAG} .
cd ${current}

docker pull us-east4-docker.pkg.dev/mish-tv/m3u8-query-proxy/server:${TAG}
docker tag us-east4-docker.pkg.dev/mish-tv/m3u8-query-proxy/server:${TAG} malt03/m3u8-query-proxy:${TAG}
docker push malt03/m3u8-query-proxy:${TAG}
