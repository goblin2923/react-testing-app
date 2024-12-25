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
            withCredentials([
                sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY'),
                sshUserPrivateKey(credentialsId: env.GITHUB_SSH_KEY, keyFileVariable: 'GIT_SSH_KEY')
            ]) {
                bat """
                    rem Copy GitHub SSH key to EC2
                    icacls "%GIT_SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                    scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no "%GIT_SSH_KEY%" ${env.DEV_SERVER}:~/.ssh/github_key
                    
                    rem Ensure correct permissions for the private key
                    ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "chmod 600 ~/.ssh/github_key"
                    
                    rem Connect to EC2 and build the app
                    ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.DEV_SERVER} "
                        ssh-keyscan github.com >> ~/.ssh/known_hosts &&
                        mkdir -p ${env.APP_DIR} &&
                        cd ${env.APP_DIR} &&
                        rm -rf * &&
                        export GIT_SSH_COMMAND='ssh -i ~/.ssh/github_key -o IdentitiesOnly=yes' &&
                        git clone git@github.com:goblin2923/react-testing-app.git . &&
                        npm install &&
                        npm run build
                    "
                """
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
