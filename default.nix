with import <nixpkgs> { }; {
  mvpluginsEnv = stdenv.mkDerivation {
    name = "mvplugins-env";
    buildInputs = [ nodejs ];
  };
}
