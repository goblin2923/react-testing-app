pipeline {
    agent any

    environment {
        DEV_SERVER = 'ubuntu@13.233.144.106'
        SSH_CREDENTIALS_ID = 'es2-key-pub'
        GITHUB_SSH_KEY = 'github-ssh-key'
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

       stage('Build and Deploy App on EC2') {
            steps {
                script {
                    echo 'Building and deploying the app on the EC2 instance...'
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            rem Ensure SSH permissions for EC2 access
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"

                            rem Connect to EC2 and execute commands
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} bash -c "'
                                mkdir -p ${env.APP_DIR} &&
                                cd ${env.APP_DIR} &&
                                rm -rf * &&
                                git clone https://github.com/goblin2923/react-testing-app.git . &&
                                npm install &&
                                npm run build
                            '"
                        """
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
}
