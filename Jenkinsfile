pipeline {
    agent any
    
    environment {
        TEST_SERVER = 'ubuntu@43.204.112.13'
        DEV_SERVER = 'ubuntu@13.233.144.106'
        APP_DIR = '/var/www/app'
        SSH_CREDENTIALS_ID = 'es2-key-pub'
        GITHUB_SSH_KEY = 'testing-ec2-ssh-key'
        GIT_REPO = 'https://github.com/goblin2923/react-testing-app.git'
    }
    
    stages {

        stage('Deploy to Dev') {
            when {
                expression { 
                    return env.GIT_BRANCH == 'origin/dev' 
                }
            }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %DEV_SERVER% "cd ~ && rm -rf react-testing-app && git clone -b testing ${env.GIT_REPO} && cd react-testing-app && sudo docker-compose down && sudo docker-compose up --build -d"
                        """
                    }
                }
            }
        }
    
        stage('Deploy to Test') {
            when {
                expression { 
                    return env.GIT_BRANCH == 'origin/testing' 
                }
            }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %TEST_SERVER% "cd ~ && rm -rf react-testing-app && git clone -b testing ${env.GIT_REPO} && cd react-testing-app && sudo docker-compose down && sudo docker-compose up --build -d"
                        """
                    }
                }
            }
        }

        stage('Run Jest Tests') {
            when {
                expression { 
                    return env.GIT_BRANCH == 'origin/testing' 
                }
            }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %TEST_SERVER% "cd ~ && cd react-testing-app && sudo docker-compose exec -T test npm test"

                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %TEST_SERVER% "if [ \$? -eq 0 ]; then echo 'Tests passed. Proceeding to Main Environment.'; else echo 'Tests failed. Stopping deployment.'; exit 1; fi"
                        """
                    }
                }
            }
        }

        stage('Merge to Master') {
            when {
                expression {
                    return env.GIT_BRANCH == 'origin/testing'
                }
            }
            steps {
                script {
                    echo 'Building and deploying the app on the EC2 instance...'
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            rem Ensure SSH permissions for EC2 access
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            
                            rem Connect to EC2 and execute deployment
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${env.TEST_SERVER} "cd ~/react-testing-app &&  git remote set-url origin git@github.com:goblin2923/react-testing-app.git && git checkout master && git merge testing && git push origin master && docker-compose down && docker-compose up --build -d"
                        """
                    }
                }
            }
        }

    }
    
    post {
        failure {
            echo 'Build or deployment failed.'
        }
    }
}