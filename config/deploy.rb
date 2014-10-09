set :application, 'frontend'
set :repo_url, ''
set :deploy_to, "/var/www/sites/#{fetch(:application)}"
set :log_level, :info
set :linked_files, %w{}
set :linked_dirs, %w{node_modules}
set :keep_releases, 5
set :npm_flags, '--silent'

set :ssh_options, {
	forward_agent: true,
	port: 22
}

before 'deploy:updated', 'grunt'
