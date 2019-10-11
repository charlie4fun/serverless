# Knative

## TODOs

- [ ] Add dev setup in Components
- [ ] Add `teardown` (or other name) methods to Components to uninstall Knative & Tekton Pipelines
- [ ] Add `setup` methods to Components to install Knative & Tekton Pipelines

## Useful links

- https://knative.dev
- https://tekton.dev
- https://github.com/GoogleContainerTools/kaniko
- https://knative.dev/docs/
- https://github.com/meteatamel/knative-tutorial
- https://kubernetes.io/docs/reference/kubectl/cheatsheet
- https://stackoverflow.com/questions/49193033/how-to-delete-and-recreate-pods-using-yaml-file-in-kubernetes
- https://stackoverflow.com/questions/50188746/apply-configuration-yaml-file-via-api-or-sdk
- https://stackoverflow.com/questions/36307950/kubernetes-api-call-equivalent-to-kubectl-apply
- https://stackoverflow.com/questions/33024969/kubernetes-rest-api
- https://stackoverflow.com/questions/53501540/kubectl-apply-f-spec-yaml-equivalent-in-fabric8-java-api

## Setup

Follow the steps posted [in this tutorial (RECOMMENDED)](https://github.com/meteatamel/knative-tutorial/blob/master/README.md) or the [official Knative docs](https://knative.dev/docs/install/).

### Create the cluster

```
export CLUSTER_NAME=knative
export CLUSTER_REGION=us-central1-a
export PROJECT=knative-hackathon
```

```
gcloud beta container clusters create $CLUSTER_NAME \
 --addons=HorizontalPodAutoscaling,HttpLoadBalancing,Istio \
 --machine-type=n1-standard-4 \
 --cluster-version=latest --zone=$CLUSTER_REGION \
 --enable-stackdriver-kubernetes --enable-ip-alias \
 --enable-autoscaling --min-nodes=1 --max-nodes=10 \
 --enable-autorepair \
 --scopes cloud-platform \
 --project $PROJECT
```

### Grant `cluster-admin` permissions

```
kubectl create clusterrolebinding cluster-admin-binding \
     --clusterrole=cluster-admin \
     --user=$(gcloud config get-value core/account)
```

### Install Knative in 2 steps

```
kubectl apply --selector knative.dev/crd-install=true \
   --filename https://github.com/knative/serving/releases/download/v0.9.0/serving.yaml \
   --filename https://github.com/knative/eventing/releases/download/v0.9.0/release.yaml \
   --filename https://github.com/knative/serving/releases/download/v0.9.0/monitoring.yaml
```

```
kubectl apply --filename https://github.com/knative/serving/releases/download/v0.9.0/serving.yaml \
   --filename https://github.com/knative/eventing/releases/download/v0.9.0/release.yaml \
   --filename https://github.com/knative/serving/releases/download/v0.9.0/monitoring.yaml
```

### Check if Knative is running

```
kubectl get pods -n knative-serving
kubectl get pods -n knative-eventing
kubectl get pods -n knative-monitoring
```

### Install Tekton Pipelines

Follow the steps posted [in this tutorial (RECOMMENDED)](https://github.com/meteatamel/knative-tutorial/blob/7a54149cd71794e5a02b63a296cbbc633ecb1340/docs/11-hellotekton.md#install-tekton-pipelines) or [the official Tekton Pipelines docs](https://github.com/tektoncd/pipeline/blob/master/docs/install.md).

```
kubectl apply -f https://storage.googleapis.com/tekton-releases/latest/release.yaml
```

### Check if Tekton Pipelines are running

```
kubectl get pods -n tekton-pipelines
```

### Install Kaniko Task for Tekton Pipelines

Follow the steps posted [in this tutorial (RECOMMENDED)](https://github.com/meteatamel/knative-tutorial/blob/7a54149cd71794e5a02b63a296cbbc633ecb1340/docs/14-tekton-kanikotaskbuild.md#install-kaniko-task) or [the official Tekton Kaniko Task docs](https://github.com/tektoncd/catalog/tree/master/kaniko).

```
kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/master/kaniko/kaniko.yaml
```

## Tekton Pipelines

### Inspect Tekton Pipelines

```
kubectl get tekton-pipelines
```

### Inspect (Tekton) Tasks

```
kubectl get task
```
