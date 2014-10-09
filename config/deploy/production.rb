set :stage, :production
set :branch, :master
set :grunt_tasks, 'build:production'

role :web, %w{deploy@example.com}
server 'example.com', user: 'deploy', roles: %w{web}
