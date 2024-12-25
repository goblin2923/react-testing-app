pipeline {
    agent any
    
    environment {
        TEST_SERVER = 'ubuntu@43.204.112.13'
        APP_DIR = '/var/www/app'
        SSH_CREDENTIALS_ID = 'es2-key-pub'
        GITHUB_SSH_KEY = 'testing-ec2-ssh-key'
        GIT_REPO = 'https://github.com/goblin2923/react-testing-app.git'
    }
    
    stages {
        
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
            // when {
            //     expression {
            //         return currentBuild.result == 'SUCCESS'
            //     }
            // }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        sh '''
                            # SSH into the server and merge changes into the master branch
                            icacls "%SSH_KEY%" /inheritance:r /grant:r "SYSTEM:F"
                            ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $TEST_SERVER "cd ~/react-testing-app && git fetch origin && git checkout master && git merge origin/testing --no-ff -m 'Merge testing into master' && git push origin master"
                        '''
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
