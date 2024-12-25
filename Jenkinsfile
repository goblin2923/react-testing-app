pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        SSH_CREDENTIALS_ID = 'es2-key-pub'
        GITHUB_SSH_KEY = 'git-key-new'
        APP_DIR = '/var/www/app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Test SSH Connectivity') {
            steps {
                script {
                    echo 'Testing SSH connection to the EC2 instance...'
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            rem Test SSH connection
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "echo SSH connection successful"
                        """
                    }
                }
            }
        }

       stage('Build App on EC2') {
    steps {
        script {
            try {
                echo 'Building the app on the EC2 instance...'
                withCredentials([sshUserPrivateKey(credentialsId: env.GITHUB_SSH_KEY, keyFileVariable: 'GIT_SSH_KEY')]) {
                    bat """
                    echo Building the app on EC2...
                    icacls "%GIT_SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                    type "%GIT_SSH_KEY%"  // Add this line to print the SSH key for debugging
                    ssh -i "%GIT_SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "mkdir -p ${env.APP_DIR} && cd ${env.APP_DIR} && ssh-keyscan github.com >> ~/.ssh/known_hosts && git clone git@github.com:goblin2923/react-testing-app.git . && npm install && npm run build"
                    """
                }
            } catch (Exception e) {
                error "Docker build failed: ${e.getMessage()}"
            }
        }
    }
}

        stage('Deploy App on EC2') {
            steps {
                script {
                    echo 'Deploying the app on the EC2 instance...'
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            rem Deploy app on EC2
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "cd ${env.APP_DIR} && docker-compose up -d"
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment succeeded!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
