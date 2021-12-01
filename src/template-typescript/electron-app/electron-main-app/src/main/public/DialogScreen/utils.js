/**
 * 获取urls参数
 */
function getQueryVariable(location, variable)
{
	let query = location.search.substring(1);
	query = decodeURI(query)
	let params = query.split("&");
	for (let i = 0; i < params.length; i++)
	{
		let pair = params[i].split("=");
		if (pair[0] === variable)
		{
			return pair[1] === 'undefined' ? null : pair[1];
		}
	}
	return null;
}

module.exports = {
	getQueryVariable
}