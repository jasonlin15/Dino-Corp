import { openDb, addEventProposal, searchEvents, searchEventsWithFilters, deleteEventProposal } from './database'

export default async function Home() {
  async function initDb() {
    'use server'
    openDb()
  }

  async function addProposal() {
    'use server'
    const proposal = {
      name: 'My Event',
      description: 'This is a description',
      organization: 'My Organization',
      tags: ['tag1', 'tag2'],
      duration: 60,
      times: [
        {
          startTime: new Date(),
          endTime: new Date()
        }
      ],
      password: 'password'
    }
    await addEventProposal(proposal)
  }

  async function searchProposal() {
    'use server'
    console.log(await searchEvents('description'))
  }

  async function searchWithFilters() {
    'use server'
    console.log(await searchEventsWithFilters('description', 30, 59, undefined, undefined))
  }

  async function deleteProposal() {
    'use server'
    await deleteEventProposal(1)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={initDb}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          Init DB
        </button>
      </form>
      <form action={addProposal}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          Add Proposal
        </button>
      </form>
      <form action={searchProposal}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          Search
        </button>
      </form>
      <form action={searchWithFilters}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          Search with Filters
        </button>
      </form>
      <form action={deleteProposal}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          Delete ID 1
        </button>
      </form>
    </main>
  );
}
