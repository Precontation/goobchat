const metricByteUnits = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB'];

/** Formats the bytes into a human-readable string (MB for example not MiB) */
export const formatBytes = (bytes: number): string => {
	if (bytes <= 0) return '0 B';

	const index = Math.floor(Math.log(bytes) / Math.log(1000));
	let calculated = bytes / 1000 ** index;
	calculated = Math.round(calculated * 10) / 10; // Round to one decimal place

	return calculated + ' ' + metricByteUnits[index];
};
