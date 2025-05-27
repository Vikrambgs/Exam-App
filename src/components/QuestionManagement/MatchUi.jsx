const MatchUi = ({ match }) => {
    const list1Labels = ["A", "B", "C", "D", "E"];
    const list2Labels = ["i", "ii", "iii", "iv", "v"];

    return (
        <div className="mb-2 w-full">
            <table className="border border-gray-600 w-full border-collapse text-gray-200">
                <thead className="">
                    <tr className="bg-slate-800 text-gray-200 uppercase border text-xs font-medium tracking-wider text-center ">
                        <th className="py-1" colSpan={2} width="50%">
                            List-I
                        </th>
                        <th
                            className="py-1 border-l "
                            colSpan={2}
                            width="50%"
                        >
                            List-II
                        </th>
                    </tr>
                </thead>
                <tbody className="border">
                    {match.list1.map((item1, index) => (
                        <tr key={index} className="bg-slate-800 border-t ">
                            <td className="w-6 text-center px-0.5 text-gray-400">
                                ({list1Labels[index]})
                            </td>
                            <td className="pl-1 py-0.5 text-sm text-gray-200">{item1}</td>
                            <td className="w-6 text-center px-0.5 border-l border-gray-200 text-gray-400">
                                ({list2Labels[index]})
                            </td>
                            <td className="pl-1 py-0.5 text-sm text-gray-200">
                                {match.list2[index]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MatchUi;
