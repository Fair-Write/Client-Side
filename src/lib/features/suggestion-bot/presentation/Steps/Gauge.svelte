<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';
	let { radius, percent }: { radius: number; percent: number } = $props();
	const strokeWidth = $derived(radius * 0.3);
	const innerRadius = $derived(radius - strokeWidth / 2);
	const circumference = $derived(innerRadius * 2 * Math.PI);
	const arc = $derived(circumference * (260 / 360));
	const dashArray = $derived(`${arc} ${circumference}`);
	const transform = $derived(`rotate(140, ${radius}, ${radius})`);

	const percentNormalized = $derived(Math.min(Math.max(percent, 0), 100));
	const offset = $derived(arc - (percentNormalized / 100) * arc);

	const percentType = $derived.by(() => {
		if (percent <= 45 && percent >= 0) {
			return 'poor';
		} else if (percent >= 50 && percent <= 70) {
			return 'average';
		} else if (percent >= 80 && percent <= 89) {
			return 'good';
		} else if (percent >= 90 && percent <= 100) {
			return 'excellent';
		}
	});
</script>

<Card.Root class="w-full">
	<Card.Header class="p-3">
		<Card.Title class="border-b border-dashed border-stone-500  text-center pb-2 text-xl font-bold "
		>Gender Fair Analysis</Card.Title
		>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2 items-center justify-center">
		<svg height={radius * 2} width={radius * 2}>
			<defs>
				<linearGradient id="grad_excellent" x1="0" y1="0" x2="1" y2="1">
					<stop offset="25%" stop-color="#a855f7" stop-opacity="1"></stop>
					<stop offset="70%" stop-color="#9333ea" stop-opacity="1"></stop>
					<stop offset="100%" stop-color="#5b21b6" stop-opacity="1"></stop>
				</linearGradient>

				<linearGradient id="grad_good" x1="0" y1="0" x2="1" y2="1">
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
				</linearGradient>

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
				{percent}%</text
			>

			<text
				class={cn(
			'text-2xl font-bold capitalize',
			percentType === 'poor' && 'fill-red-500',
			percentType === 'average' && 'fill-amber-500',
			percentType === 'good' && 'fill-blue-500',
			percentType === 'excellent' && 'fill-purple-500'
		)}
				x="50%"
				y="80%"
				dominant-baseline="middle"
				text-anchor="middle"
			>{percentType}
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

			<circle
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
			/>
		</svg>

		<p class="text-center text-base">Out of X phrases only Z is considered gender fair</p>
	</Card.Content>
</Card.Root>




