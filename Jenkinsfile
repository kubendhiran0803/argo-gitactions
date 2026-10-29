
pipeline {
    agent {
        kubernetes {
            inheritFrom 'default'
        }
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Application') {
            steps {
                sh '''
                    echo "Checking application files..."
                    test -s index.html
                    test -f style.css
                    test -f app.js
                    echo "Application validation successful!"
                '''
            }
        }
    }
}
