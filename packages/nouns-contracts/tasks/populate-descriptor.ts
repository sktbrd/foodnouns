import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data-v2.json';
import { dataToDescriptorInput } from './utils';

task('populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptor` contract address',
    '0x9726D188B674a728312dF828C45618f54e03cB46',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptor` contract address',
    '0xAC1c2D05fAFA512c611a388859104d41F9c207C4',
    types.string,
  )
  .setAction(async ({ nftDescriptor, nounsDescriptor }, { ethers, network }) => {
    const options = { gasLimit: network.name === 'hardhat' ? 30000000 : undefined };

    const descriptorFactory = await ethers.getContractFactory('NounsDescriptorV2', {
      libraries: {
        NFTDescriptorV2: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nounsDescriptor);

    const { bgcolors, palette, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;

    const bodiesPage = dataToDescriptorInput(bodies.map(({ data }) => data));
    const headsPage = dataToDescriptorInput(heads.map(({ data }) => data));
    const glassesPage = dataToDescriptorInput(glasses.map(({ data }) => data));
    const accessoriesPage = dataToDescriptorInput(accessories.map(({ data }) => data));

    await descriptorContract.addManyBackgrounds(bgcolors);
    await descriptorContract.setPalette(0, `0x000000${palette.join('')}`);

    await descriptorContract.addBodies(
      bodiesPage.encodedCompressed,
      bodiesPage.originalLength,
      bodiesPage.itemCount,
      options,
    );
    await descriptorContract.addHeads(
      headsPage.encodedCompressed,
      headsPage.originalLength,
      headsPage.itemCount,
      options,
    );
    await descriptorContract.addGlasses(
      glassesPage.encodedCompressed,
      glassesPage.originalLength,
      glassesPage.itemCount,
      options,
    );
    await descriptorContract.addAccessories(
      accessoriesPage.encodedCompressed,
      accessoriesPage.originalLength,
      accessoriesPage.itemCount,
      options,
    );

    console.log('Descriptor populated with palettes and parts.');
  });
