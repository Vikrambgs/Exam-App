const MatchUi = ({ match }) => {
    const list1Labels = ["A", "B", "C", "D", "E"];
    const list2Labels = ["i", "ii", "iii", "iv", "v"];

    return (
        <div className="mb-2 w-full">
            <table className="border border-gray-600 w-full">
                <thead className="bg-gray-50">
                    <tr className="bg-gray-200">
                        <th className="py-1 text-center text-xs font-medium text-black uppercase tracking-wider" colSpan={2} width="50%">List-I</th>
                        <th className="py-1 text-center text-xs font-medium text-black uppercase tracking-wider border-l border-gray-600" colSpan={2} width="50%">List-II</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {match.list1.map((item1, index) => (
                        <tr key={index} className="border-t border-gray-600">
                            <td className="w-6 text-center px-0.5 text-gray-600">({list1Labels[index]})</td>
                            <td className="pl-1 py-0.5 text-sm text-gray-800">
                                {item1}
                            </td>
                            <td className="w-6 text-center px-0.5 border-l border-gray-600 text-gray-600">({list2Labels[index]})</td>
                            <td className="pl-1 py-0.5 text-sm text-gray-800">
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
