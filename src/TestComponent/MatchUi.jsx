const MatchUi = ({ match }) => {
    match = {
        "list1": [
            "Poison declaration and action program",
            "United Nations Commission on International Trade Law",
            "International Convention on Civil and Political Rights",
            "General Agreement on Trade and Services",
            "This Is One More List"
        ],
        "list2": [
            "Provided a framework for domestic laws on intervention in the event of a chemical attack",
            "United Nations High Commission for Human Rights ",
            "Liberalisation of Legal Services",
            "Free legal aid and access to justice",
            "Here it is one more also"
        ],
    }

    const list1Labels = ["A", "B", "C", "D", "E"];
    const list2Labels = ["i", "ii", "iii", "iv", "v"];

    return (
        <div className="mb-4">
            <table className="border border-gray-600">
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
                            <td className="pl-1 py-0.5 pr-4 text-sm text-gray-800">
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
