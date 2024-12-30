#!/bin/bash

# Function to check if a command exists
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

missing_deps=0

# Check for uv
if ! (command_exists uv); then
  missing_deps=1
  echo "❌ uv is not installed."
  echo ""
  echo "To install uv, visit the official download page:"
  echo "👉 https://docs.astral.sh/uv/getting-started/installation/"
  echo ""
fi

# Exit with a bad exit code if any dependencies are missing
if [ "$missing_deps" -ne 0 ]; then
  echo "Install the missing dependencies and ensure they are on your path. Then run this command again."
  # TODO: remove sleep when cli bug is fixed
  sleep 2
  exit 1
fi

# Check for extism-js
if ! command_exists extism-py; then
  echo "❌ extism-py is not installed."
  echo ""
  echo "extism-py is needed to compile the plug-in. You can find the instructions to install it here: https://github.com/extism/python-pdk"
  echo ""
  echo "Alternatively, you can use an install script."
  echo ""
  echo "🔹 Mac / Linux:"
  echo "curl -L https://raw.githubusercontent.com/extism/python-pdk/main/install.sh | bash"
  echo ""
  # TODO: remove sleep when cli bug is fixed
  sleep 2
  exit 1
fi

# fetch dataclass wizard
if [ ! -d dataclass-wizard-0.33.0 ]; then
  curl -O https://files.pythonhosted.org/packages/0a/2a/6ae6638cd5ca919b73d393cdb4a4e53c8c3dcacc003a79d9480ecad46798/dataclass-wizard-0.33.0.tar.gz
  tar xf dataclass-wizard-0.33.0.tar.gz
fi

# fetch typing extensions
if [ ! -d typing_extensions-4.12.2 ]; then
  curl -O https://files.pythonhosted.org/packages/df/db/f35a00659bc03fec321ba8bce9420de607a1d37f8342eee1863174c69557/typing_extensions-4.12.2.tar.gz
  tar xf typing_extensions-4.12.2.tar.gz
fi
