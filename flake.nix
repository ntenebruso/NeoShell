{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, ags, astal }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    astalPackages = with astal.packages.${system}; [
        astal3
        io
        apps
        battery
        hyprland
        mpris
        network
        notifd
        tray
        wireplumber
      ];
    
    extraPackages = astalPackages ++ [
      pkgs.gtk3
      pkgs.dart-sass
    ];
  in {
    packages.${system}.default = pkgs.stdenv.mkDerivation {
      name = "neoshell";
      src = ./.;
      entry = "app.tsx";

      nativeBuildInputs = with pkgs; [
        wrapGAppsHook
        gobject-introspection
        ags.packages.${system}.default
      ];

      buildInputs = extraPackages ++ [
        pkgs.gjs
        pkgs.glib
      ];

      installPhase = ''
        runHook preInstall

        mkdir -p $out/bin
        mkdir -p $out/share
        cp -r * $out/share
        ags bundle app.tsx $out/bin/neoshell -d "SRC='$out/share'"

        runHook postInstall
      '';

      postInstall = ''
        wrapProgram $out/bin/neoshell \
          --prefix PATH : ${
            nixpkgs.lib.makeBinPath [
              pkgs.dart-sass
            ]
          }
      '';
    };


    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [
        (ags.packages.${system}.default.override {
          inherit extraPackages;
        })
        pkgs.gjs
        pkgs.glib
        pkgs.gobject-introspection
        pkgs.wrapGAppsHook
        pkgs.dart-sass
      ];
    };

    overlay = final: prev: {
      neoshell = prev.writeShellScriptBin "neoshell" ''
        if [ "$#" -eq 0 ]; then
            PRODUCTION=true exec ${self.packages.${system}.default}/bin/neoshell
        else
            PRODUCTION=true exec ${pkgs.astal.io}/bin/astal -i neoshell "$@"
        fi
      '';
    };

    homeManagerModules.neoshell = import ./nix/module.nix self;
  };
}
