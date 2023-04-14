//! Static Web Server for the [Torrust Index Frontend](https://github.com/torrust/torrust-index-frontend).
//!
//! This is a simple web server that serves static files from a directory.
//!
//! You can use this to serve the Torrust Index Frontend. You can configure
//! the server with the `config.toml` file.
//!
//! Refer to [Static Web Sever Documentation](https://static-web-server.net/)
//! for more information.
#![forbid(unsafe_code)]
#![deny(warnings)]
#![deny(rust_2018_idioms)]
#![deny(dead_code)]

#[cfg(all(target_env = "musl", target_pointer_width = "64"))]
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;

use static_web_server::Result;

fn main() -> Result {
    #[cfg(windows)]
    {
        use static_web_server::settings::{Commands, Settings};
        use static_web_server::winservice;

        let opts = Settings::get()?;

        if let Some(commands) = opts.general.commands {
            match commands {
                Commands::Install {} => {
                    return winservice::install_service(opts.general.config_file);
                }
                Commands::Uninstall {} => {
                    return winservice::uninstall_service();
                }
            }
        } else if opts.general.windows_service {
            return winservice::run_server_as_service();
        }
    }

    static_web_server::Server::new()?.run_standalone()?;

    Ok(())
}
