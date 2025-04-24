self:

{
  lib,
  pkgs,
  config,
  ...
}:

let
  cfg = config.programs.neoshell;
  package = pkgs.neoshell;
in {
  options.programs.neoshell = {
    enable = lib.mkEnableOption "NeoShell";
    systemd.enable = lib.mkEnableOption "systemd integration";
    settings = lib.mkOption { default = { }; };
  };

  config = let
    finalConfig = builtins.toJSON cfg.settings;
  in
  lib.mkIf cfg.enable {
    nixpkgs.overlays = [ self.overlay ];

    home.packages = [ package ];

    xdg.configFile.neoshell = {
      target = "neoshell/config.json";
      text = finalConfig;
      onChange = "${package}/bin/neoshell r";
    };

    
    systemd.user.services.neoshell = lib.mkIf cfg.systemd.enable {
      Unit = {
        Description = "NeoShell";
        Documentation = "https://github.com/ntenebruso/neoshell";
        PartOf = ["graphical-session.target"];
        After = ["graphical-session.target"];
      };

      Service = {
        ExecStart = "${package}/bin/neoshell";
        Restart = "on-failure";
        KillMode = "mixed";
      };

      Install = {
        WantedBy = ["graphical-session.target"];
      };
    };
  };
}
