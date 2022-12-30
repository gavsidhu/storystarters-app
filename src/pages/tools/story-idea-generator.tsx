import { Select } from 'flowbite-react';
import { HiOutlineArrowPath } from 'react-icons/hi2';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';

const genres = [
  {
    id: '1',
    name: 'Drama',
  },
  {
    id: '2',
    name: 'Fantasy',
  },
  {
    id: '3',
    name: 'Mystery',
  },
  {
    id: '4',
    name: 'Romance',
  },
  {
    id: '5',
    name: 'Sci-Fi',
  },
];

const StoryIdeaGenerator = () => {
  //const [loading, setLoading] = useState(false)
  return (
    <Layout title='Story Idea Generator'>
      <div className='mx-auto lg:max-w-7xl '>
        <div className='mt-4 py-6'>
          <div className='my-3'>
            <p>Select a genre and hit generate to get a story idea.</p>
          </div>
          <div className='flex flex-row items-center space-x-4'>
            <Select>
              {genres.map((genre) => {
                return (
                  <option key={genre.id} id={genre.id}>
                    {genre.name}
                  </option>
                );
              })}
            </Select>
            <Button>
              Generate{' '}
              <span>
                <HiOutlineArrowPath className=' ml-2 h-4 w-4' />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoryIdeaGenerator;
