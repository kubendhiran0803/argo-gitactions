
pipeline {
    agent {
        kubernetes {
            inheritFrom 'default'
            defaultContainer 'jnlp'
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: kaniko
      image: gcr.io/kaniko-project/executor:v1.23.2-debug
      command:
        - /busybox/cat
      tty: true
'''
        }
    }

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        IMAGE_NAME = 'kubendhiran0803/argo-gitactions'
        GIT_REPO = 'https://github.com/kubendhiran0803/argo-gitactions.git'
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                checkout scm
            }
        }

        stage('Validate Application') {
            steps {
                sh '''
                    set -eu
                    test -s index.html
                    test -f style.css
                    test -f app.js
                    test -f Dockerfile
                    test -f k8s/deployment.yaml
                    echo "Application validation successful!"
                '''
            }
        }

        stage('Prepare Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short=12 HEAD',
                        returnStdout: true
                    ).trim()

                    echo "Image tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                container('kaniko') {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'dockerhub-credentials',
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_TOKEN'
                        )
                    ]) {
                        sh '''
                            set +x
                            set -eu

                            mkdir -p /kaniko/.docker

                            AUTH=$(printf '%s' "$DOCKER_USER:$DOCKER_TOKEN" | base64 | tr -d '\\n')

                            printf '{"auths":{"https://index.docker.io/v1/":{"auth":"%s"}}}' "$AUTH" > /kaniko/.docker/config.json

                            /kaniko/executor \
                              --context "dir://$WORKSPACE" \
                              --dockerfile "$WORKSPACE/Dockerfile" \
                              --destination "$IMAGE_NAME:$IMAGE_TAG"

                            rm -f /kaniko/.docker/config.json
                        '''
                    }
                }
            }
        }

        stage('Update Kubernetes Manifest') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-credentials',
                        usernameVariable: 'GITHUB_USER',
                        passwordVariable: 'GITHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        set -eu

                        git config user.name "jenkins-ci"
                        git config user.email "jenkins-ci@users.noreply.github.com"

                        sed -i -E \
                          "s|image: kubendhiran0803/argo-gitactions:[^[:space:]]+|image: $IMAGE_NAME:$IMAGE_TAG|" \
                          k8s/deployment.yaml

                        grep -F "image: $IMAGE_NAME:$IMAGE_TAG" k8s/deployment.yaml

                        git add k8s/deployment.yaml

                        if git diff --cached --quiet; then
                            echo "Manifest already uses this image."
                            exit 0
                        fi

                        git commit -m "ci: update image to $IMAGE_TAG [skip ci]"

                        ASKPASS_FILE=$(mktemp)
                        trap 'rm -f "$ASKPASS_FILE"' EXIT

                        cat > "$ASKPASS_FILE" <<'EOF'
#!/bin/sh
case "$1" in
  *Username*) printf '%s\n' "$GITHUB_USER" ;;
  *Password*) printf '%s\n' "$GITHUB_TOKEN" ;;
esac
EOF

                        chmod 700 "$ASKPASS_FILE"
                        export GIT_ASKPASS="$ASKPASS_FILE"
                        export GIT_TERMINAL_PROMPT=0

                        git push "$GIT_REPO" HEAD:main
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI completed. Argo CD can now sync the new image.'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
        always {
            deleteDir()
        }
    }
}
