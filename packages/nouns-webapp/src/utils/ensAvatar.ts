import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';

export const useEnsAvatarLookup = (address: string) => {
  const { library } = useEthers();
  const [ensAvatar, setEnsAvatar] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (address && library && library.network) {
      // ENS
      library.network.ensAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e';

      library
        .lookupAddress(address)
        .then(name => {
          if (!name) return;
          library.getResolver(name).then(resolver => {
            if (!resolver) return;
            resolver
              .getText('avatar')
              .then(avatar => {
                if (mounted) {
                  setEnsAvatar(avatar);
                }
              })
              .catch(error => {
                console.log(`error resolving ens avatar: `, error);
              });
          });
        })
        .catch(error => {
          console.log(`error resolving reverse ens lookup: `, error);
        });
    }

    return () => {
      setEnsAvatar('');
      mounted = false;
    };
  }, [address, library]);

  return ensAvatar;
};
