pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        SSH_CREDENTIALS_ID = 'dev-server-ssh-key'
        APP_DIR = '/var/www/app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Fetching code from the dev branch...'
                git branch: 'dev', 
                    url: 'git@github.com:goblin2923/react-testing-app', 
                    credentialsId: 'react-ssh-key'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                bat 'docker-compose build'
            }
        }

        stage('Deploy to Dev Environment') {
            steps {
                echo 'Deploying application to the Dev environment...'
                withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                    // Using Windows-compatible commands
                    bat """
                        echo "Creating directory on remote server..."
                        ssh -i "%SSH_KEY%" ${DEV_SERVER} "mkdir -p ${APP_DIR}"
                        
                        echo "Copying files to remote server..."
                        scp -i "%SSH_KEY%" -r .\\build\\* ${DEV_SERVER}:${APP_DIR}/
                        
                        echo "Starting Docker containers on remote server..."
                        ssh -i "%SSH_KEY%" ${DEV_SERVER} "cd ${APP_DIR} && docker-compose up -d"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment to Dev environment succeeded!'
        }
        failure {
            echo 'Deployment to Dev environment failed.'
        }
    }
}