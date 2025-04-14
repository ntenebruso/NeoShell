{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, ags }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    agsPackages = with ags.packages.${system}; [
        apps
        battery
        hyprland
        mpris
        network
        notifd
        tray
        wireplumber
      ];
  in {
    packages.${system}.default = ags.lib.bundle {
      inherit pkgs;
      src = ./.;
      name = "neoshell";
      entry = "app.ts";
      gtk4 = false;

      extraPackages = agsPackages;
    };


    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [
        (ags.packages.${system}.default.override {
          extraPackages = agsPackages;
        })
      ];
    };

    overlay = final: prev: {
      neoshell = prev.writeShellScriptBin "neoshell" ''
        if [ "$#" -eq 0 ]; then
            PRODUCTION=true exec ${self.packages.${system}.default}/bin/neoshell
        else
            PRODUCTION=true exec ${ags.packages.${system}.io}/bin/astal -i neoshell "$*"
        fi
      '';
    };

    homeManagerModules.neoshell = import ./nix/module.nix self;
  };
}
