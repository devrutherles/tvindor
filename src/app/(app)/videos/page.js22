import {
    ArrowUpIcon,
    ArrowDownIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
const people = [
    {
        name: 'Lindsay Walton',
        title: 'Front-end Developer',
        department: 'Optimization',
        email: 'lindsay.walton@example.com',
        role: 'Member',
        image:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    // More people...
]

export default function Videos() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        Plans
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Your team is on the{' '}
                        <strong className="font-semibold text-gray-900">
                            Startup
                        </strong>{' '}
                        plan. The next payment of $80 will be due on August 4,
                        2022.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Update credit card
                    </button>
                </div>
            </div>

            <div className="mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                Video
                            </th>

                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Status
                            </th>

                            <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                <span className="sr-only">Ação</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {people.map(person => (
                            <tr key={person.email}>
                                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                                    <div className="flex items-center">
                                        <div className="h-11 w-11 flex-shrink-0">
                                            <img
                                                className="h-11 w-11 rounded-full"
                                                src={person.image}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900">
                                                {person.name}
                                            </div>
                                            <div className="mt-1 text-gray-500">
                                                {person.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        Active
                                    </span>
                                </td>
                                <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                    <div className="flex flex-row gap-2 justify-center">
                                        <a
                                            href="#"
                                            className="text-indigo-600 hover:text-indigo-900">
                                            <ArrowDownIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </a>
                                        <a
                                            href="#"
                                            className="text-indigo-600 hover:text-indigo-900">
                                            <ArrowUpIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </a>
                                        <a
                                            href="#"
                                            className="text-indigo-600 hover:text-indigo-900">
                                            <TrashIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
