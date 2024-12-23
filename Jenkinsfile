pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106' // Replace with your Dev server's IP
        SSH_CREDENTIALS_ID = '2e49be1c-6b70-48d5-a094-b569e7afae66' // Use the ID of your SSH credentials
        APP_DIR = '/var/www/app' // Replace with your app's deployment directory
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Fetching code from dev branch...'
                git branch: 'dev', url: 'git@github.com:goblin2923/react-testing-app'
            }
        }

        stage('Build Docker Containers') {
            steps {
                echo 'Building Docker images...'
                sh '''
                docker-compose build
                '''
            }
        }

        stage('Deploy to Dev Environment') {
            steps {
                echo 'Deploying application to Dev environment...'
                sshagent (credentials: [SSH_CREDENTIALS_ID]) {
                    sh '''
                    ssh ${DEV_SERVER} "cd ${APP_DIR} && git pull origin dev && docker-compose up -d"
                    '''
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
