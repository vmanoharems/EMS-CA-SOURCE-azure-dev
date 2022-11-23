SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[Get]
	@COAID int 
AS
BEGIN
	select COAID,COACODE,a.AccountCode as [Set],
a.AccountName as SetDescription, a.AccountID as SetID
 from COA Cross Join  tblaccounts a  where 
  COAID=@COAID
and a.SegmentID=11  Order By COACOde,[Set]
END



GO