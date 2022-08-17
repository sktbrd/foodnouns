import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { cache, cacheKey, CHAIN_ID } from '../config';

const NNS_REGISTRY = '0x3e1970dc478991b49c4327973ea8a4862ef5a4de';
const ENS_REGISTRY = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e';

export const ensCacheKey = (address: string) => {
  return cacheKey(cache.ens, CHAIN_ID, address);
};

export const useReverseENSLookUp = (address: string) => {
  const { library } = useEthers();
  const [ens, setEns] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (address && library && library.network) {
      // set to NNS
      library.network.ensAddress = NNS_REGISTRY;

      // Look for resolved ENS in local storage (result of pre-fetching)
      const maybeCachedENSResultRaw = localStorage.getItem(ensCacheKey(address));
      if (maybeCachedENSResultRaw) {
        const maybeCachedENSResult = JSON.parse(maybeCachedENSResultRaw);
        if (parseInt(maybeCachedENSResult.expires) > Date.now() / 1000) {
          setEns(maybeCachedENSResult.name);
        } else {
          localStorage.removeItem(ensCacheKey(address));
        }
      }

      // If address not in local storage, attempt to resolve via RPC call.
      // At this stage if the item is in local storage we know it isn't expired.
      if (!localStorage.getItem(ensCacheKey(address))) {
        library
          .lookupAddress(address)
          .then(name => {
            if (!name) {
              library.network.ensAddress = ENS_REGISTRY;
              library
                .lookupAddress(address)
                .then(name2 => {
                  if (!name2) return;
                  if (mounted) {
                    setEns(name2);
                  }
                })
                .catch(error => {
                  console.log(`error resolving reverse ens lookup: `, error);
                });
            } else {
              if (mounted) {
                setEns(name);
              }
            }
          })
          .catch(error => {
            console.log(`error resolving reverse ens lookup: `, error);
          });
      }
    }

    return () => {
      setEns('');
      mounted = false;
    };
  }, [address, library]);

  return ens;
};
