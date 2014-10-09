set :stage, :development
set :branch, :develop
set :grunt_tasks, 'build'

role :web, %w{deploy@development.example.com}
server 'development.example.com', user: 'deploy', roles: %w{web}
