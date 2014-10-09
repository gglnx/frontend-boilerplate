set :stage, :staging
set :branch, :master
set :grunt_tasks, 'build'

role :web, %w{deploy@staging.example.com}
server 'staging.example.com', user: 'deploy', roles: %w{web}
