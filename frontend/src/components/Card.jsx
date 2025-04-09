const Card = ({ icon, heading, paragraph }) => {
	return (
		<div className='flex flex-col items-center justify-center text-center w-3/4 bg-primary rounded-2xl h-48 p-8 gap-2'>
			<i className={`${icon} text-2xl`}></i>
			<h2 className='text-xl'>{heading}</h2>
			<p className='text-sm'>{paragraph}</p>
		</div>
	);
};

export default Card;
