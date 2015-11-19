define(['underscore'],
function (_)
{
  'use strict';

  var types = {
    'aggregates': 'aggregates',
    'images': 'images',
    'types': 'types',
    'hardware': 'hardware',
    'linkTypes': 'linkTypes',
    'sharedvlans': 'sharedvlans',
    'linkNodes1': 'types',
    'linkNodes2': 'types'
  };

  var debug = false;

  function Constraints(context)
  {
    var that = this;
    that.groups = {};
    that.possible = {};
    _.each(_.keys(types), function (type) {
      var typeOption = types[type];
      that.possible[type] = [];
      _.each(context.canvasOptions[typeOption], function (value) {
	that.possible[type].push(value.id);
      });
    });
    this.allowAllSets(context.constraints);
  }

  Constraints.prototype.allowAllSets = function (list)
  {
    var that = this;
    _.each(list, function (set) {
      that.allowSet(set, true);
      if (set['node'] || set['node2'])
      {
	var swapped = _.clone(set);
	swapped['node'] = set['node2'];
	swapped['node2'] = set['node'];
	that.allowSet(swapped, false);
	if (set['node'] && set['link'] && ! set['node2'])
	{
	  swapped = _.clone(set);
	  swapped['node2'] = swapped['node'];
	  that.allowSet(swapped, false);
	}
	else if (set['node2'] && set['link'] && ! set['node'])
	{
	  swapped = _.clone(set);
	  swapped['node'] = swapped['node2'];
	  that.allowSet(swapped, false);
	}
      }
    });
  };

  Constraints.prototype.allowSet = function (set, shouldComplain)
  {
    var that = this;
    var groupKey = makeGroupKey(set);
    that.groups[groupKey] = that.groups[groupKey] || [];
    var isDuplicate = false;
    _.each(that.groups[groupKey], function (oldSet) {
      if (_.isEqual(set, oldSet))
      {
	isDuplicate = true;
	if (shouldComplain)
	{
	  console.log('Duplicate constraint', set);
	}
      }
    });
    if (! isDuplicate)
    {
      that.groups[groupKey].push(set);
    }
  };

  // Returns a list of valid ids of unboundType inside of the
  // unboundSubclause which are a valid match when combined with every
  // bound item in the boundList
  Constraints.prototype.getValidList = function (boundList,
						 unboundSubclause,
						 unboundType,
						 rejected)
  {
    if (debug) { console.log('List for: ', unboundSubclause, unboundType); }
    var that = this;
    var result = [];
    _.each(that.possible[unboundType], function (item) {
      var candidateList = [];
      _.each(boundList, function (item) {
	var clone = {};
	_.each(_.keys(item), function (key) {
	  clone[key] = _.clone(item[key]);
	});
	candidateList.push(clone);
      });
      _.each(candidateList, function (candidate) {
	if (debug) { console.log('-', unboundType, item); }
	if (! candidate[unboundSubclause])
	{
	  candidate[unboundSubclause] = {};
	}
	candidate[unboundSubclause][unboundType] = item;
      });
      if (that.allValid(candidateList))
      {
	result.push(item);
      }
      else if (rejected)
      {
	rejected.push(item);
      }
    });
    if (debug) { console.log('Overall result is', result); }
    return result;
  };

  // Returns true if all candidates in the candidate list match every
  // group.
  Constraints.prototype.allValid = function (candidateList)
  {
    var that = this;
    var result = true;
    _.each(candidateList, function (candidate) {
      result = result && that.isValid(candidate);
    });
    if (debug) { console.log('-', 'End Candidate List: ', candidateList); }
    return result;
  };

  // Check to see if a single candidate is valid. A candidate is valid
  // if it matches every group. Candidate subkeys contain strings
  // while clause subkeys contain lists of strings.
  Constraints.prototype.isValid = function (candidate)
  {
    var that = this;
    var result = true;
    _.each(_.keys(that.groups), function (groupKey) {
      result = result && that.isValidForGroup(candidate, that.groups[groupKey]);
    });
    if (debug) { console.log('--', 'Candidate: ', result, candidate); }
    return result;
  };

  // A group is a set of clauses which target identical keys. These
  // are not explicit in the input, but are implicitly grouped by
  // looking at the actual keys. A group is valid if any clause in the
  // group matches.
  Constraints.prototype.isValidForGroup = function (candidate, group)
  {
    var result = false;
    _.each(group, function (clause) {
      result = result || matchClause(candidate, clause, this.possible);
    }.bind(this));
    if (debug) { console.log('---', 'Group: ', result, candidate, group); }
    return result;
  };

  // A clause is the atomic unit of the whitelist. This is one item on
  // the list of constraints. If all the sub-keys match, the whole
  // thing matches.
  function matchClause(candidate, clause, possible)
  {
    var result = true;
    if (candidate['link'] || ! clause['link'])
    {
      _.each(_.keys(clause), function (key) {
	result = result && (! candidate[key] || ! clause[key] ||
			    matchSubkeys(candidate[key], clause[key],
					 possible));
      });
    }
    if (debug) { console.log('----', 'Clause: ', result, candidate, clause); }
    return result;
  };

  // Clauses are logically divided into three subkey components for
  // clarity. These are the 'node', 'link', and 'node2'
  // sub-clauses. All of the sub-clauses have to match in order for
  // the clause as a whole to match.
  function matchSubkeys(candidateSub, clauseSub, possible)
  {
    var result = true;
    _.each(_.keys(clauseSub), function (key) {
      result = result && (! candidateSub[key] || ! clauseSub[key] ||
			  possible[key].indexOf(candidateSub[key]) === -1 ||
			  _.contains(clauseSub[key], '*') ||
			  _.contains(clauseSub[key], candidateSub[key]));
    });
    if (debug) { console.log('-----', 'Subkeys: ', result, candidateSub, clauseSub); }
    return result;
  };

  function makeGroupKey(obj)
  {
    var result = '';
    var keyList = _.keys(obj);
    keyList.sort();
    _.each(keyList, function (outer) {
      if (obj[outer])
      {
	var innerKeys = _.keys(obj[outer]);
	innerKeys.sort();
	result += ':' + outer + ':' + innerKeys.join('~');
      }
    });
    return result;
  }

  return Constraints;
});
