<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';
	import { GLFScore } from '$lib/stores/omegaLOL';
	import { textContent } from '$lib/stores/textFromEditorStore';
	let { radius, percent }: { radius: number; percent: number } = $props();
	const strokeWidth = $derived(radius * 0.3);
	const innerRadius = $derived(radius - strokeWidth / 2);
	const circumference = $derived(innerRadius * 2 * Math.PI);
	const arc = $derived(circumference * (260 / 360));
	const dashArray = $derived(`${arc} ${circumference}`);
	const transform = $derived(`rotate(140, ${radius}, ${radius})`);
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	const percentNormalized = $derived(Math.floor((1 - percent) * 100));
	const offset = $derived(arc - (percentNormalized / 100) * arc);

	/** 
	@deprecated 
	**/
	// const percentType = $derived.by(() => {
	// 	console.log('percent', percent);

	// 	console.log('percent normalized', percentNormalized);

	// 	if (percentNormalized <= 45 && percentNormalized >= 0) {
	// 		return 'poor';
	// 	} else if (percentNormalized >= 50 && percentNormalized <= 70) {
	// 		return 'average';
	// 	} else if (percentNormalized >= 80 && percentNormalized <= 89) {
	// 		return 'good';
	// 	} else if (percentNormalized >= 90 && percentNormalized <= 100) {
	// 		return 'excellent';
	// 	}
	// });
</script>

<Card.Root class="w-full">
	<Card.Header class="p-3">
		<Card.Title class="border-b border-dashed border-stone-500  pb-2 text-center text-xl font-bold "
			>Gender Fair Analysis</Card.Title
		>
	</Card.Header>
	<Card.Content class="flex flex-col items-center justify-center gap-2">
		<svg height={radius * 2} width={radius * 2}>
			<defs>
				<linearGradient id="grad_excellent" x1="0" y1="0" x2="1" y2="1">
					<stop offset="25%" stop-color="#a855f7" stop-opacity="1"></stop>
					<stop offset="70%" stop-color="#9333ea" stop-opacity="1"></stop>
					<stop offset="100%" stop-color="#5b21b6" stop-opacity="1"></stop>
				</linearGradient>

				<!-- <linearGradient id="grad_good" x1="0" y1="0" x2="1" y2="1">
					<stop offset="25%" stop-color="#3b82f6" stop-opacity="1"></stop>
					<stop offset="70%" stop-color="#2563eb" stop-opacity="1"></stop>
					<stop offset="100%" stop-color="#4338ca" stop-opacity="1"></stop>
				</linearGradient>

				<linearGradient id="grad_average" x1="0" y1="0" x2="1" y2="0">
					<stop offset="10%" stop-color="#fde047 " stop-opacity="0.5"></stop>
					<stop offset="50%" stop-color="#facc15" stop-opacity="1"></stop>
					<stop offset="100%" stop-color="#d97706" stop-opacity="1"></stop>
				</linearGradient>

				<linearGradient id="grad_poor" x1="0" y1="0" x2="1" y2="0">
					<stop offset="50%" stop-color="#fee2e2 " stop-opacity="0.1"></stop>
					<stop offset="90%" stop-color="#ef4444" stop-opacity="1"></stop>
					<stop offset="100%" stop-color="#b91c1c" stop-opacity="1"></stop>
				</linearGradient> -->

				<filter id="strong-inner">
					<feFlood flood-color="#d6d3d1" />

					<!-- This next operation subtracts the original shape from the red color
					field filling the filter region - which will give you a big color border
					surrounding the original shape -->
					<feComposite operator="out" in2="SourceGraphic" />

					<!-- Next we want to expand the red border so it overlaps the space of the
					original shape - the radius 4 below will expand it by 4 pixels -->

					<feMorphology operator="dilate" radius="1" />
					<feGaussianBlur stdDeviation="5" />

					<!-- After blurring it, we want to select just the parts of the blurred,
					expanded border that overlap the original shape - which we can do by using
					the 'atop' operator -->

					<feComposite operator="atop" in2="SourceGraphic" />
				</filter>
			</defs>
			<!-- 
			<text
				class={cn(
					'text-5xl font-bold',
					percentType === 'poor' && 'fill-red-500',
					percentType === 'average' && 'fill-amber-500',
					percentType === 'good' && 'fill-blue-500',
					percentType === 'excellent' && 'fill-purple-500'
				)}
				x="50%"
				y="50%"
				dominant-baseline="middle"
				text-anchor="middle"
			>
				{percentNormalized}%</text
			> -->
			<text
				class={cn('text-4xl font-bold', 'fill-purple-500')}
				x="50%"
				y="50%"
				dominant-baseline="middle"
				text-anchor="middle"
			>
				{$GLFScore}/{$textContent.split(' ').length}
			</text>
			<text
				class={cn('text-xl font-bold capitalize', 'fill-purple-500')}
				x="50%"
				y="82%"
				dominant-baseline="middle"
				text-anchor="middle"
			>
				Total Score
			</text>

			<circle
				cx={radius}
				cy={radius}
				fill="transparent"
				r={innerRadius}
				stroke="#fafaf9"
				stroke-width={strokeWidth}
				stroke-dasharray={dashArray}
				{transform}
				filter="url(#strong-inner)"
			/>

			<!-- <circle
				class="gauge_percent"
				cx={radius}
				cy={radius}
				fill="transparent"
				r={innerRadius}
				stroke={`url(#grad_${percentType})`}
				style={"transition: 'stroke-dasharray 0.3s'"}
				stroke-width={strokeWidth}
				stroke-dashoffset={offset}
				stroke-dasharray={dashArray}
				{transform}
			/> -->

			<circle
				class="gauge_percent"
				cx={radius}
				cy={radius}
				fill="transparent"
				r={innerRadius}
				stroke={`url(#grad_excellent)`}
				style={"transition: 'stroke-dasharray 0.3s'"}
				stroke-width={strokeWidth}
				stroke-dashoffset={offset}
				stroke-dasharray={dashArray}
				{transform}
			/>
		</svg>

		<p class="text-center text-base">
			{$GLFScore} out of {$textContent.split(' ').length} word/s in the document were found as non-gender
			fair
		</p>

		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div
						class="group rounded-full border border-solid border-orange-500 p-2 hover:bg-orange-500 hover:transition-all hover:ease-in-out"
					>
						<p class="text-base font-bold text-orange-500 group-hover:text-white">* DISCLAIMER *</p>
					</div></Tooltip.Trigger
				>
				<Tooltip.Content class="flex h-[250px] w-[200px] items-center justify-center 2xl:w-[300px]">
					<p class="text-sm 2xl:text-base">
						At present, there is no universally accepted or standardized instrument for determining
						whether a text is truly gender-fair.
						<br />
						<br />
						Assessments of gender fairness in language may vary depending on cultural context, linguistic
						norms, and individual interpretation.
					</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</Card.Content>
</Card.Root>
