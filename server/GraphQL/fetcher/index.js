async function fetchGraphQL(endpoint, query, variables = {}) {
    try {
        const result = await fetch(
            `${endpoint}`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables,
                })
            }
        )

        return result.ok ? await result.json() : null
    } catch (e) {
        console.error("The Request to GraphQL war aborted! " + e.name + " " + e.message)
        return null
    }
}

export default fetchGraphQL