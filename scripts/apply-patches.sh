#!/bin/sh
# Apply patches to node_modules
cd "$(dirname "$0")/.."

# @cutls/megalodon patches (Hollo emoji_reaction support)
for patch in patches/@cutls+megalodon+7.2.4.patch; do
  [ -f "$patch" ] || continue
  echo "Applying $(basename "$patch")..."
  patch -p1 -d node_modules/@cutls/megalodon -N -r /dev/null < "$patch" || echo "  (already applied or failed)"
done
