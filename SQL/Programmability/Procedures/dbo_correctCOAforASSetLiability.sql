SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Proc [dbo].[correctCOAforASSetLiability]
As
Begin



declare @cocount int
declare @countaccount int
declare @multiple int
select @cocount=count(distinct SS1)  from COA 

select @countaccount=count(distinct accountid) from  coa  where  accounttypeid in (4,5) 
set @multiple=@cocount*@countaccount

delete from COA where Accounttypeid in (4,5)  and COAID not in (
select top(@multiple)COAID   from COA  where  AccountTypeId  in (4,5) and accountid in
(
select accountid  from tblaccounts  where  accounttypeid in (4,5) and segmenttype='Detail')   Order by ss2,ss3,ss4,ss5,ss6,ss7,ss8)

delete  from COA  where (COACOde like '%|00|%' or COACOde like '%|000|%' or COACode Like '%|0000|%' or COACODE like '%|0|%') and Accounttypeid not in (4,5)


ENd








GO